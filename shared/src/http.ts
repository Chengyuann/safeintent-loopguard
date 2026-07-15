import { aspManifest } from "./aspManifest";
import { demoScenarios } from "./data/scenarios";
import { runGuard } from "./policy/guard";
import { compileMandate } from "./policy/mandate";
import { detectSocialRisks } from "./policy/socialRisk";
import type { GuardInput } from "./types";

const JSON_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=utf-8"
};

export async function handleSafeIntentRequest(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: JSON_HEADERS });
    }

    if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/api/health")) {
      return json({
        ok: true,
        service: "SafeIntent LoopGuard",
        version: "0.1.0",
        endpoints: {
          guard: "/api/guard/check",
          mandate: "/api/mandate/compile",
          socialRisk: "/api/intake/social-risk",
          manifest: "/api/asp/manifest"
        }
      });
    }

    if (request.method === "GET" && url.pathname === "/api/scenarios") {
      return json({ scenarios: demoScenarios });
    }

    if (request.method === "GET" && url.pathname === "/api/asp/manifest") {
      return json(aspManifest);
    }

    if (request.method === "POST" && url.pathname === "/api/intake/social-risk") {
      const body = await readJson<{ text?: string }>(request);
      return json({ social_risks: detectSocialRisks(body.text ?? "") });
    }

    if (request.method === "POST" && url.pathname === "/api/mandate/compile") {
      const body = await readJson<{ text?: string }>(request);
      return json({ mandate: compileMandate(body.text ?? "") });
    }

    if (
      request.method === "POST" &&
      (url.pathname === "/api/guard/check" || url.pathname === "/api/receipt/generate")
    ) {
      const body = await readJson<GuardInput>(request);
      return json(runGuard(body));
    }

    return json({ error: "Not found", path: url.pathname }, 404);
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
