import type { SocialRisk } from "../types";

interface SocialRule {
  code: string;
  label: string;
  severity: number;
  patterns: RegExp[];
}

const SOCIAL_RULES: SocialRule[] = [
  {
    code: "urgency_detected",
    label: "Urgency pressure",
    severity: 13,
    patterns: [/before midnight/i, /today only/i, /last chance/i, /limited time/i, /24\s*hours/i, /马上|立刻|今晚|最后机会|倒计时/]
  },
  {
    code: "official_impersonation",
    label: "Possible official impersonation",
    severity: 16,
    patterns: [/official support/i, /admin team/i, /okx team/i, /wallet support/i, /官方客服|管理员|OKX\s*官方|钱包客服/]
  },
  {
    code: "wallet_upgrade_claim",
    label: "Wallet upgrade or verification claim",
    severity: 18,
    patterns: [/upgrade (your )?wallet/i, /verify (your )?wallet/i, /wallet migration/i, /升级钱包|验证钱包|迁移钱包/]
  },
  {
    code: "seed_phrase_request",
    label: "Seed phrase request",
    severity: 35,
    patterns: [/seed phrase/i, /recovery phrase/i, /mnemonic/i, /助记词|恢复短语|私钥/]
  },
  {
    code: "guaranteed_return",
    label: "Guaranteed return language",
    severity: 14,
    patterns: [/guaranteed/i, /risk[- ]?free/i, /fixed return/i, /保本|稳赚|无风险|固定收益/]
  },
  {
    code: "pay_to_unlock_reward",
    label: "Pay-to-unlock reward",
    severity: 20,
    patterns: [/pay .*unlock/i, /gas .*unlock/i, /deposit .*reward/i, /先付.*领取|支付.*解锁|打款.*奖励/]
  },
  {
    code: "shortened_link",
    label: "Shortened or suspicious link",
    severity: 10,
    patterns: [/bit\.ly/i, /t\.co\//i, /tinyurl/i, /短链接/]
  },
  {
    code: "unverified_domain",
    label: "Unverified external domain",
    severity: 12,
    patterns: [/claim[-.]?now/i, /airdrop[-.]?verify/i, /wallet[-.]?upgrade/i, /领取.*链接|空投.*链接/]
  }
];

export function detectSocialRisks(text: string): SocialRisk[] {
  return SOCIAL_RULES.flatMap((rule) => {
    const match = rule.patterns.find((pattern) => pattern.test(text));
    if (!match) {
      return [];
    }

    return [
      {
        code: rule.code,
        label: rule.label,
        severity: rule.severity,
        evidence: findEvidence(text, match)
      }
    ];
  });
}

function findEvidence(text: string, pattern: RegExp): string {
  const match = text.match(pattern);
  if (!match || match.index === undefined) {
    return text.slice(0, 120);
  }

  const start = Math.max(0, match.index - 50);
  const end = Math.min(text.length, match.index + match[0].length + 50);
  return text.slice(start, end).trim();
}
