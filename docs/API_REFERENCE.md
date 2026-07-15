# API Reference

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

## `POST /api/guard/check`

Runs the full SafeIntent guard.

## `POST /api/receipt/generate`

Alias for the full guard response, intended for receipt-oriented clients.
