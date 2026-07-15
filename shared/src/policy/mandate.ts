import type { MandatePolicy } from "../types";

const DEFAULT_POLICY: Omit<MandatePolicy, "source_text"> = {
  wallet_roles: {
    main: {
      allowed: ["read_balance", "read_eligibility", "view_signature", "read_only"],
      blocked: ["unknown_approval", "delegate_authorization", "state_changing_claim"]
    },
    burner: {
      allowed: ["small_claim", "limited_approval", "read_only"],
      blocked: ["seed_phrase_request", "private_key_request"],
      limits: {
        max_value_usd: 10,
        max_approval_usd: 5,
        approval_expiry_minutes: 30
      }
    }
  },
  payment_policy: {
    max_total_usd: 5,
    max_single_call_usd: 1,
    max_repeated_calls_per_tool: 3
  },
  ask_before: ["cross_chain", "new_domain", "new_contract", "approval", "paid_tool_retry"],
  block: ["seed_phrase_request", "private_key_request", "unlimited_approval", "unknown_delegate"]
};

export function compileMandate(text: string): MandatePolicy {
  const normalized = text.toLowerCase();
  const policy: MandatePolicy = structuredClone({
    ...DEFAULT_POLICY,
    source_text: text
  });

  const budget = extractMoneyLimit(normalized, ["budget", "paid", "spend", "tool", "x402", "预算", "付费"]);
  if (budget !== null) {
    policy.payment_policy.max_total_usd = budget;
  }

  const singleCallLimit = extractMoneyLimit(normalized, ["single", "per call", "each", "单次"]);
  if (singleCallLimit !== null) {
    policy.payment_policy.max_single_call_usd = singleCallLimit;
  }

  const repeatedLimit = extractCountLimit(normalized, ["repeat", "same tool", "repeated", "连续", "重复"]);
  if (repeatedLimit !== null) {
    policy.payment_policy.max_repeated_calls_per_tool = repeatedLimit;
  }

  if (containsAny(normalized, ["main wallet", "主钱包"])) {
    ensure(policy.wallet_roles.main.blocked, "main_wallet_state_change");
  }

  if (containsAny(normalized, ["burner", "小钱包", "燃烧钱包", "新钱包"])) {
    ensure(policy.ask_before, "switch_to_burner_wallet");
  }

  if (containsAny(normalized, ["no unknown", "unknown approval", "陌生授权", "陌生合约", "unknown contract"])) {
    ensure(policy.wallet_roles.main.blocked, "unknown_contract");
    ensure(policy.block, "unknown_contract");
  }

  if (containsAny(normalized, ["unlimited", "infinite", "无限授权", "最大授权"])) {
    ensure(policy.block, "unlimited_approval");
  }

  if (containsAny(normalized, ["cross-chain", "cross chain", "bridge", "跨链", "桥"])) {
    ensure(policy.ask_before, "cross_chain");
  }

  if (containsAny(normalized, ["delegate", "delegation", "7702", "委托", "代理权限"])) {
    ensure(policy.block, "unknown_delegate");
  }

  if (containsAny(normalized, ["ask me", "confirm", "问我", "确认", "先问"])) {
    ensure(policy.ask_before, "manual_confirmation");
  }

  return policy;
}

function extractMoneyLimit(text: string, contextWords: string[]): number | null {
  if (!contextWords.some((word) => text.includes(word))) {
    return null;
  }

  const matches = [...text.matchAll(/(?:under|below|less than|<=|不超过|低于|小于|最多)?\s*(\d+(?:\.\d+)?)\s*(?:u|usd|usdt|dollar|美金|美元)/gi)];
  if (matches.length === 0) {
    return null;
  }

  return Number(matches[0][1]);
}

function extractCountLimit(text: string, contextWords: string[]): number | null {
  if (!contextWords.some((word) => text.includes(word))) {
    return null;
  }

  const matches = [...text.matchAll(/(?:under|below|less than|<=|不超过|低于|小于|最多)?\s*(\d+)\s*(?:times|calls|次)/gi)];
  if (matches.length === 0) {
    return null;
  }

  return Number(matches[0][1]);
}

function ensure(list: string[], value: string): void {
  if (!list.includes(value)) {
    list.push(value);
  }
}

function containsAny(text: string, needles: string[]): boolean {
  return needles.some((needle) => text.includes(needle));
}
