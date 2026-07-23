# API Reference

Production base URL:

```text
https://safeintent-loopguard.pages.dev
```

## `GET /api/health`

Returns server status.

## `GET /api/scenarios`

Returns bundled demo scenarios.

## `GET /api/asp/manifest`

Returns the ASP manifest object used by the demo.

## `POST /api/intake/social-risk`

Runs only the social-context risk detector.

## `POST /api/mandate/compile`

Compiles a natural-language mandate into deterministic policy.

## `/api/guard/check`

- `GET` / `HEAD`: returns an endpoint-readiness response for service discovery and marketplace review.
- `OPTIONS`: returns CORS capabilities.
- Empty `POST` or `POST {}`: returns the readiness response and required input schema.
- Valid JSON `POST`: runs the full SafeIntent guard.
- Partially populated or invalid JSON `POST`: returns a structured `400` response.

Required JSON fields:

```text
session_id
user_goal
social_context.source
social_context.text
user_mandate_text
agent_plan
```

## `POST /api/receipt/generate`

Alias for the full guard response, intended for receipt-oriented clients.
