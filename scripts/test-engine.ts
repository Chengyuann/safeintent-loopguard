import { demoScenarios, runGuard } from "../shared/src";

let failed = 0;

for (const scenario of demoScenarios) {
  const result = runGuard(scenario.input);
  const pass = result.decision === scenario.expected_decision;

  console.log(`${pass ? "PASS" : "FAIL"} ${scenario.id}: expected ${scenario.expected_decision}, got ${result.decision} (${result.risk_score})`);
  console.log(`  ${result.summary}`);

  if (!pass) {
    failed += 1;
  }
}

if (failed > 0) {
  process.exitCode = 1;
}
