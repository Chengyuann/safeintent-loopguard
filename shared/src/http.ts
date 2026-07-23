import { aspManifest } from "./aspManifest";
import { demoScenarios } from "./data/scenarios";
import { runGuard } from "./policy/guard";
import { compileMandate } from "./policy/mandate";
import { detectSocialRisks } from "./policy/socialRisk";
import type { GuardInput } from "./types";

const JSON_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8"
};

const guardProbePayload = {
  ok: true,
  service: "SafeIntent LoopGuard",
  endpoint: "/api/guard/check",
  method: "POST",
  inputRequired: true,
  input_required: true,
  accepts: "application/json",
  description:
    "Checks a planned agent execution against social context and a user safety mandate before paid tools, approvals, signatures, wallet actions, or loops.",
  required_fields: ["session_id", "user_goal", "social_context", "user_mandate_text", "agent_plan"],
  fields: ["session_id", "user_goal", "social_context", "user_mandate_text", "agent_plan"],
  requiredAnyOf: [],
  inputSchema: {
    type: "object",
    required: ["session_id", "user_goal", "social_context", "user_mandate_text", "agent_plan"],
    properties: {
      session_id: { type: "string" },
      user_goal: { type: "string" },
      social_context: {
        type: "object",
        required: ["source", "text"],
        properties: {
          source: { type: "string" },
          text: { type: "string" }
        }
      },
      user_mandate_text: { type: "string" },
      agent_plan: {
        type: "array",
        items: {
          type: "object",
          required: ["type"],
          properties: {
            type: { type: "string" }
          }
        }
      }
    }
  },
  health: "/api/health",
  manifest: "/api/asp/manifest"
};

export async function handleSafeIntentRequest(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const pathname = normalizePath(url.pathname);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: JSON_HEADERS });
    }

    if (isReadProbe(request) && (pathname === "/" || pathname === "/api/health")) {
      return probeResponse(request, healthPayload());
    }

    if (
      isReadProbe(request) &&
      (pathname === "/api/guard/check" || pathname === "/api/receipt/generate")
    ) {
      return probeResponse(request, guardProbePayload);
    }

    if (request.method === "GET" && pathname === "/api/scenarios") {
      return json({ scenarios: demoScenarios });
    }

    if (request.method === "GET" && pathname === "/api/asp/manifest") {
      return json(aspManifest);
    }

    if (request.method === "POST" && pathname === "/api/intake/social-risk") {
      const body = await readJson<{ text?: string }>(request);
      return json({ social_risks: detectSocialRisks(body.text ?? "") });
    }

    if (request.method === "POST" && pathname === "/api/mandate/compile") {
      const body = await readJson<{ text?: string }>(request);
      return json({ mandate: compileMandate(body.text ?? "") });
    }

    if (
      request.method === "POST" &&
      (pathname === "/api/guard/check" || pathname === "/api/receipt/generate")
    ) {
      const rawBody = await readGuardJson(request);
      if (rawBody === null || (isRecord(rawBody) && Object.keys(rawBody).length === 0)) {
        return json(guardProbePayload);
      }
      const body = validateGuardInput(rawBody);
      return json(runGuard(body));
    }

    if (pathname === "/api/guard/check" || pathname === "/api/receipt/generate") {
      return methodNotAllowed(pathname);
    }

    return json({ error: "Not found", path: pathname }, 404);
  } catch (error) {
    const status = error instanceof RequestError ? error.status : 500;
    return json(
      {
        error: status === 500 ? "SafeIntent service error" : "Invalid request",
        message: error instanceof Error ? error.message : String(error)
      },
      status
    );
  }
}

function normalizePath(pathname: string): string {
  if (pathname === "/") {
    return pathname;
  }
  return pathname.replace(/\/+$/, "");
}

async function readGuardJson(request: Request): Promise<unknown | null> {
  if (request.body === null) {
    return null;
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new RequestError(415, "Content-Type must be application/json.");
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > 256_000) {
    throw new RequestError(413, "Request body is too large.");
  }

  const text = await request.text();
  if (text.trim().length === 0) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new RequestError(400, "Request body must contain valid JSON.");
  }
}

function isReadProbe(request: Request): boolean {
  return request.method === "GET" || request.method === "HEAD";
}

function probeResponse(request: Request, payload: unknown): Response {
  if (request.method === "HEAD") {
    return new Response(null, { status: 200, headers: JSON_HEADERS });
  }
  return json(payload);
}

function methodNotAllowed(path: string): Response {
  return Response.json(
    {
      error: "Method not allowed",
      path,
      allowed_methods: ["GET", "HEAD", "POST", "OPTIONS"]
    },
    {
      status: 405,
      headers: {
        ...JSON_HEADERS,
        Allow: "GET, HEAD, POST, OPTIONS"
      }
    }
  );
}

function healthPayload() {
  return {
    ok: true,
    service: "SafeIntent LoopGuard",
    version: "0.1.0",
    endpoints: {
      guard: "/api/guard/check",
      mandate: "/api/mandate/compile",
      socialRisk: "/api/intake/social-risk",
      manifest: "/api/asp/manifest"
    }
  };
}

async function readJson<T>(request: Request): Promise<T> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new RequestError(415, "Content-Type must be application/json.");
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > 256_000) {
    throw new RequestError(413, "Request body is too large.");
  }

  try {
    return (await request.json()) as T;
  } catch {
    throw new RequestError(400, "Request body must contain valid JSON.");
  }
}

function validateGuardInput(value: unknown): GuardInput {
  if (!isRecord(value)) {
    throw new RequestError(400, "Request body must be a JSON object.");
  }

  const missing = [
    ["session_id", isNonEmptyString(value.session_id)],
    ["user_goal", isNonEmptyString(value.user_goal)],
    ["social_context", isRecord(value.social_context)],
    ["social_context.source", isRecord(value.social_context) && isNonEmptyString(value.social_context.source)],
    ["social_context.text", isRecord(value.social_context) && isNonEmptyString(value.social_context.text)],
    ["user_mandate_text", isNonEmptyString(value.user_mandate_text)],
    ["agent_plan", Array.isArray(value.agent_plan)]
  ]
    .filter(([, valid]) => !valid)
    .map(([field]) => field);

  if (missing.length > 0) {
    throw new RequestError(400, `Missing or invalid required field(s): ${missing.join(", ")}.`);
  }

  for (const [index, step] of (value.agent_plan as unknown[]).entries()) {
    if (!isRecord(step) || !isNonEmptyString(step.type)) {
      throw new RequestError(400, `Missing or invalid required field(s): agent_plan[${index}].type.`);
    }
  }

  return {
    session_id: value.session_id,
    user_goal: value.user_goal,
    social_context: {
      source: (value.social_context as Record<string, unknown>).source as string,
      text: (value.social_context as Record<string, unknown>).text as string
    },
    user_mandate_text: value.user_mandate_text,
    agent_plan: value.agent_plan
  } as GuardInput;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function json(payload: unknown, status = 200): Response {
  return Response.json(payload, { status, headers: JSON_HEADERS });
}

class RequestError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
  }
}
