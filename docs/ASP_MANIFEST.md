# SafeIntent LoopGuard ASP Listing

## Service

- Agent ID: `5848`
- Registration status: registered, not yet activated
- Name: SafeIntent LoopGuard
- Type: A2MCP-compatible pre-execution risk guard
- Category: Software Utility / Finance Copilot
- Pricing model: free demo mode; paid per guard check in production
- Registered service: Pre-Execution Risk Check

## Store Description

SafeIntent LoopGuard helps OKX.AI agents preserve a user's real intent before execution.

It ingests Web3 social context from voice transcripts, AMAs, DMs, support calls, or community chat, compiles the user's natural-language safety rules into a machine-readable mandate, then checks whether an agent plan conflicts with that mandate before paid MCP calls, x402-style payments, wallet approvals, signatures, or repeated tool loops.

The service returns an execution decision (`ALLOW`, `WARN`, `ASK_MORE`, or `BLOCK`), conflict evidence, a safer rewrite, policy JSON, and an Intent-to-Action Receipt.

## Best For

- Airdrop eligibility checks that must stay read-only.
- AI agents using paid Web3 data tools.
- Agentic wallet workflows that need budget, approval, and wallet-role controls.
- Detecting MCP tool-output instruction injection before signing or payment.
- Turning social voice and community claims into enforceable execution policy.

## Endpoint Shape

```http
POST https://safeintent-loopguard.pages.dev/api/guard/check
Content-Type: application/json
```

The service can run as a free endpoint for demos. A production deployment can add an HTTP 402 / x402 payment challenge before returning the full receipt.

## Tool Definition

```json
{
  "name": "safeintent_guard_check",
  "description": "Checks whether an agent plan conflicts with the user's Web3 safety mandate before paid tools, wallet actions, approvals, signatures, or cross-chain steps.",
  "inputSchema": {
    "type": "object",
    "required": ["session_id", "user_goal", "social_context", "user_mandate_text", "agent_plan"],
    "properties": {
      "session_id": { "type": "string" },
      "user_goal": { "type": "string" },
      "social_context": {
        "type": "object",
        "properties": {
          "source": { "type": "string" },
          "text": { "type": "string" }
        }
      },
      "user_mandate_text": { "type": "string" },
      "agent_plan": {
        "type": "array",
        "items": { "type": "object" }
      }
    }
  },
  "outputSchema": {
    "type": "object",
    "required": ["decision", "risk_score", "summary", "conflicts", "safe_rewrite", "receipt"],
    "properties": {
      "decision": { "enum": ["ALLOW", "WARN", "ASK_MORE", "BLOCK"] },
      "risk_score": { "type": "number" },
      "summary": { "type": "string" },
      "conflicts": { "type": "array", "items": { "type": "string" } },
      "safe_rewrite": { "type": "array", "items": { "type": "string" } },
      "receipt": { "type": "object" }
    }
  }
}
```

## Example Input

```json
{
  "session_id": "demo-airdrop-001",
  "user_goal": "Check whether I am eligible for this airdrop.",
  "social_context": {
    "source": "discord_ama_transcript",
    "text": "The speaker says this is the official support window. Everyone must upgrade your wallet before midnight to unlock rewards. Use the claim-now portal and approve the wallet verification contract."
  },
  "user_mandate_text": "Use my main wallet only for checking. No unknown approvals. No unlimited approval. Paid tool budget under 5 USDT. If a claim needs approval, ask me first and use a burner wallet.",
  "agent_plan": [
    {
      "type": "mcp_call",
      "tool": "airdrop_eligibility_checker",
      "cost_usd": 0.5,
      "is_paid": true
    },
    {
      "type": "wallet_action",
      "action": "approve",
      "contract": "0xUnknownClaimContract",
      "approval": "unlimited",
      "wallet_role": "main"
    }
  ]
}
```

## Example Output

```json
{
  "decision": "BLOCK",
  "risk_score": 100,
  "summary": "Blocked because the plan conflicts with the user's mandate and contains high-risk wallet actions.",
  "conflicts": [
    {
      "code": "unlimited_approval",
      "label": "Unlimited approval"
    },
    {
      "code": "read_only_to_state_change",
      "label": "Read-only task escalated to execution"
    }
  ],
  "safe_rewrite": [
    "Keep the main wallet read-only.",
    "Verify the contract through official sources.",
    "Ask the user before any approval or burner-wallet claim."
  ]
}
```

## Example Pricing Copy

Free preview returns a compact decision and conflict list. Paid mode returns a full Intent-to-Action Receipt with safer rewrite plan, loop diagnosis, and integration-ready policy JSON.

## Safety Boundary

- Does not execute transactions.
- Does not request seed phrases or private keys.
- Does not provide financial advice.
- Does not claim that a project is guaranteed safe.
- Returns pre-execution policy decisions and safer rewrite suggestions only.
