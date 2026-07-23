import { demoScenarios, handleSafeIntentRequest } from "../shared/src";

const endpoint = "https://safeintent-loopguard.example/api/guard/check";

let failed = 0;

await check("GET guard probe", new Request(endpoint), 200, async (response) => {
  const body = await response.json() as { ok?: boolean; method?: string; input_required?: boolean };
  return body.ok === true && body.method === "POST" && body.input_required === true;
});

await check("HEAD guard probe", new Request(endpoint, { method: "HEAD" }), 200, async (response) => {
  return (await response.text()) === "";
});

await check(
  "GET guard probe with trailing slash",
  new Request(`${endpoint}/`),
  200,
  async (response) => {
    const body = await response.json() as { inputRequired?: boolean; inputSchema?: unknown };
    return body.inputRequired === true && Boolean(body.inputSchema);
  }
);

await check("OPTIONS guard probe", new Request(endpoint, { method: "OPTIONS" }), 204);

await check(
  "POST without a body",
  new Request(endpoint, { method: "POST" }),
  200,
  async (response) => {
    const body = await response.json() as { ok?: boolean; input_required?: boolean };
    return body.ok === true && body.input_required === true;
  }
);

await check(
  "POST empty text body without content type",
  new Request(endpoint, { method: "POST", body: "" }),
  200,
  async (response) => {
    const body = await response.json() as { ok?: boolean; input_required?: boolean };
    return body.ok === true && body.input_required === true;
  }
);

await check(
  "POST empty object",
  jsonRequest(endpoint, {}),
  200,
  async (response) => {
    const body = await response.json() as { ok?: boolean; input_required?: boolean };
    return body.ok === true && body.input_required === true;
  }
);

await check(
  "POST partial invalid object",
  jsonRequest(endpoint, { session_id: "probe" }),
  400,
  async (response) => {
    const body = await response.json() as { error?: string; message?: string };
    return body.error === "Invalid request" && Boolean(body.message?.includes("user_goal"));
  }
);

await check(
  "POST valid guard request",
  jsonRequest(endpoint, demoScenarios[0].input),
  200,
  async (response) => {
    const body = await response.json() as { decision?: string; risk_score?: number };
    return body.decision === "BLOCK" && body.risk_score === 100;
  }
);

await check("Unknown route", new Request("https://safeintent-loopguard.example/api/missing"), 404);
await check("Unsupported guard method", new Request(endpoint, { method: "PUT" }), 405);

if (failed > 0) {
  process.exitCode = 1;
}

async function check(
  label: string,
  request: Request,
  expectedStatus: number,
  validate?: (response: Response) => Promise<boolean>
) {
  const { handleSafeIntentRequest } = await import("../shared/src/http");
  const response = await handleSafeIntentRequest(request);
  const valid = response.status === expectedStatus && (validate ? await validate(response.clone()) : true);

  console.log(`${valid ? "PASS" : "FAIL"} ${label}: expected ${expectedStatus}, got ${response.status}`);
  if (!valid) {
    failed += 1;
    console.log(`  ${await response.text()}`);
  }
}

function jsonRequest(url: string, body: unknown): Request {
  return new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}
