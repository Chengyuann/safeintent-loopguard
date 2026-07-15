export type Decision = "ALLOW" | "WARN" | "ASK_MORE" | "BLOCK";

export type SocialSource =
  | "discord_ama_transcript"
  | "x_space_transcript"
  | "telegram_voice_transcript"
  | "dm_thread"
  | "support_call"
  | "manual_note";

export interface SocialContext {
  source: SocialSource | string;
  text: string;
}

export type AgentPlanStep =
  | McpCallStep
  | WalletActionStep
  | PaymentStep
  | ResearchStep
  | ToolOutputStep;

export interface BasePlanStep {
  id?: string;
  label?: string;
  evidence?: string;
}

export interface McpCallStep extends BasePlanStep {
  type: "mcp_call";
  tool: string;
  cost_usd?: number;
  purpose?: string;
  output_summary?: string;
  is_paid?: boolean;
}

export interface WalletActionStep extends BasePlanStep {
  type: "wallet_action";
  action:
    | "approve"
    | "permit"
    | "transfer"
    | "claim"
    | "delegate"
    | "sign_message"
    | "cross_chain"
    | "revoke";
  contract?: string;
  domain?: string;
  approval?: "none" | "limited" | "unlimited";
  wallet_role?: "main" | "burner" | "unknown";
  value_usd?: number;
  chain?: string;
  recipient?: string;
}

export interface PaymentStep extends BasePlanStep {
  type: "payment";
  protocol: "x402" | "ap2" | "card" | "unknown";
  amount_usd: number;
  merchant?: string;
  reason?: string;
}

export interface ResearchStep extends BasePlanStep {
  type: "research";
  action: "summarize" | "verify_domain" | "check_contract" | "check_social" | "read_only";
  target?: string;
}

export interface ToolOutputStep extends BasePlanStep {
  type: "tool_output";
  tool: string;
  content: string;
}

export interface GuardInput {
  session_id: string;
  user_goal: string;
  social_context: SocialContext;
  user_mandate_text: string;
  agent_plan: AgentPlanStep[];
}

export interface MandatePolicy {
  wallet_roles: {
    main: WalletRolePolicy;
    burner: WalletRolePolicy;
  };
  payment_policy: {
    max_total_usd: number;
    max_single_call_usd: number;
    max_repeated_calls_per_tool: number;
  };
  ask_before: string[];
  block: string[];
  source_text: string;
}

export interface WalletRolePolicy {
  allowed: string[];
  blocked: string[];
  limits?: {
    max_value_usd?: number;
    max_approval_usd?: number;
    approval_expiry_minutes?: number;
  };
}

export interface SocialRisk {
  code: string;
  label: string;
  severity: number;
  evidence: string;
}

export interface Conflict {
  code: string;
  label: string;
  severity: number;
  evidence: string;
  recommendation: string;
}

export interface IntentReceipt {
  session_id: string;
  user_goal: string;
  social_source: string;
  mandate_summary: string;
  planned_action_summary: string;
  payment_summary: string;
  wallet_summary: string;
  decision: Decision;
  conflicts: string[];
  policy_result: string;
  generated_at: string;
}

export interface GuardResult {
  decision: Decision;
  risk_score: number;
  summary: string;
  social_risks: SocialRisk[];
  conflicts: Conflict[];
  safe_rewrite: string[];
  mandate: MandatePolicy;
  receipt: IntentReceipt;
  diagnostics: {
    total_paid_usd: number;
    repeated_tools: Record<string, number>;
    high_risk_steps: string[];
  };
}

export interface DemoScenario {
  id: string;
  title: string;
  subtitle: string;
  expected_decision: Decision;
  input: GuardInput;
}
