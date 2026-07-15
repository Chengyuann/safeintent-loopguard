export const aspManifest = {
  name: "SafeIntent LoopGuard",
  version: "0.1.0",
  description:
    "A voice-aware pre-execution guard for OKX.AI agents that checks social context, user mandates, MCP calls, x402-style payments, and wallet actions before execution.",
  categories: ["Software Utility", "Finance Copilot", "Creative Genius"],
  pricing: {
    mode: "demo_free",
    production_model: "pay_per_guard_check",
    x402_ready: true,
    free_preview: ["decision", "risk_score", "conflicts"],
    paid_receipt: ["intent_receipt", "safe_rewrite", "policy_json", "loop_diagnostics"]
  },
  tools: [
    {
      name: "safeintent_guard_check",
      description:
        "Checks whether an agent plan conflicts with the user's Web3 safety mandate before paid tools, wallet actions, approvals, signatures, or cross-chain steps.",
      endpoint: "/api/guard/check",
      method: "POST"
    },
    {
      name: "safeintent_compile_mandate",
      description: "Compiles a natural-language wallet and agent-spend mandate into deterministic policy JSON.",
      endpoint: "/api/mandate/compile",
      method: "POST"
    },
    {
      name: "safeintent_social_risk_intake",
      description: "Detects social-risk signals from Web3 voice transcripts, AMAs, DMs, and chat snippets.",
      endpoint: "/api/intake/social-risk",
      method: "POST"
    }
  ],
  safety_boundary: [
    "Does not execute transactions",
    "Does not request seed phrases or private keys",
    "Does not provide financial advice",
    "Returns pre-execution policy decisions only"
  ]
};
