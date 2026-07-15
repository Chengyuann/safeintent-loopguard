# Deviations

This file records conservative deviations from `docs/SAFEINTENT_LOOPGUARD_PLAN.md`.

| Date | Planned Path | Deviation | Reason | Conservative Resolution |
|---|---|---|---|---|
| 2026-07-12 | Build real OKX.AI registration and live x402 payment flow in the initial skeleton. | Initial implementation uses a mock-compatible ASP manifest and x402 metadata fields only. | Live OKX.AI registration may require account review, endpoint publication, and credentials; hard-coding assumptions would be brittle. | Build a deterministic local ASP-shaped API first, document the integration points, and keep the payment shape compatible with HTTP 402/x402 concepts. |
| 2026-07-12 | Include real-time audio/ASR in MVP. | MVP starts with voice transcript/social text input. | The product thesis depends on social-risk context and mandate compilation, not raw ASR quality; real-time ASR can be added later without changing the guard API. | Implement transcript-first UI and label audio upload as a next-step adapter. |
| 2026-07-12 | Run local API verification on default port `8787`. | Verification used `8788`. | Port `8787` was already occupied by another process. | Do not kill unknown processes; run `PORT=8788 npm run dev:server` when needed. |
| 2026-07-12 | Use Playwright's bundled Chromium for browser verification. | Verification used system Google Chrome. | Playwright was available but its browser binary was not installed. | Avoid a large browser install; launch `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` through Playwright. |
