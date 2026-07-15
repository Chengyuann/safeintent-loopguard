import http from "node:http";
import { aspManifest, compileMandate, demoScenarios, detectSocialRisks, runGuard, type GuardInput } from "../../shared/src";

const PORT = Number(process.env.PORT ?? 8787);

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "127.0.0.1"}`);

    if (request.method === "OPTIONS") {
      sendJson(response, 204, {});
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/health") {
      sendJson(response, 200, { ok: true, service: "SafeIntent LoopGuard", version: "0.1.0" });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/scenarios") {
      sendJson(response, 200, { scenarios: demoScenarios });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/asp/manifest") {
      sendJson(response, 200, aspManifest);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/intake/social-risk") {
      const body = await readJson<{ text?: string }>(request);
      sendJson(response, 200, { social_risks: detectSocialRisks(body.text ?? "") });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/mandate/compile") {
      const body = await readJson<{ text?: string }>(request);
      sendJson(response, 200, { mandate: compileMandate(body.text ?? "") });
      return;
    }

    if (request.method === "POST" && (url.pathname === "/api/guard/check" || url.pathname === "/api/receipt/generate")) {
      const body = await readJson<GuardInput>(request);
      sendJson(response, 200, runGuard(body));
      return;
    }

    sendJson(response, 404, { error: "Not found", path: url.pathname });
  } catch (error) {
    sendJson(response, 500, {
      error: "SafeIntent server error",
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`SafeIntent LoopGuard API listening on http://127.0.0.1:${PORT}`);
});

function sendJson(response: http.ServerResponse, status: number, payload: unknown): void {
  response.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8"
  });

  if (status === 204) {
    response.end();
    return;
  }

  response.end(JSON.stringify(payload, null, 2));
}

async function readJson<T>(request: http.IncomingMessage): Promise<T> {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw.trim()) {
    return {} as T;
  }

  return JSON.parse(raw) as T;
}
