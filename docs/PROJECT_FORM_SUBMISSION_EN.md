# SafeIntent LoopGuard - Project Form Submission

## Basic Information

### Name

```text
SafeIntent LoopGuard
```

### Introduction (under 200 characters)

```text
A pre-execution firewall that turns Web3 social context and user mandates into policy before AI agents spend, sign, approve, call paid tools, or loop.
```

Character count: 150.

## Project Tracks (up to 4)

Select:

```text
AI
Infra
DeFi
Other
```

For `Other`, enter:

```text
Agent Security / Software Utility
```

## Technical Tags (up to 8)

Select the available tags:

```text
React
Node
Web3
AI
```

Add these custom tags:

```text
TypeScript
Vite
MCP
Cloudflare Pages
```

Do not select `Solidity` or `Ethers`: the current submission does not include a deployed smart contract or live on-chain transaction implementation.

## Links

### MVP Link

```text
https://safeintent-loopguard.pages.dev/
```

### Project Link

```text
https://github.com/Chengyuann/safeintent-loopguard
```

### X / Twitter Link

```text
https://x.com/macy200201
```

### X Participation Post

```text
https://x.com/macy200201/status/2077289018283483331
```

### Wallet

Connect a wallet that you control and that meets the hackathon network requirements. Never provide a private key, seed phrase, or recovery phrase.

## Square Logo

Upload this file:

```text
outputs/submission-images/safeintent-loopguard-logo-square.png
```

Specification: `1024x1024` PNG, dark rounded-square mark without long text, suitable for project cards and profile images.

Transparent alternative:

```text
outputs/submission-images/safeintent-loopguard-logo-transparent.png
```

## Project Images (4 images, all 1280x720)

1. `outputs/submission-images/01-safeintent-home.png`
2. `outputs/submission-images/02-social-context.png`
3. `outputs/submission-images/03-loop-guard.png`
4. `outputs/submission-images/04-intent-receipt.png`

Contact sheet:

```text
outputs/submission-images/submission-images-contact-sheet.codex-preview.jpg
```

## Video

### Project Demo

```text
outputs/demo-recording/safeintent-loopguard-demo-voiceover-subtitles.mp4
```

Properties: 59.08 seconds, 1440x900, H.264 + AAC, English narration, and burned-in English subtitles.

### Project Pitch

If the platform allows the same video in both fields, upload the current demo video again. If separate files are mandatory, duplicate the current demo video under a pitch-specific filename. Do not upload the archived pre-typewriter video.

## Description

```text
SafeIntent LoopGuard is a pre-execution risk firewall for AI agents and agentic wallets.

Web3 risk often starts before a wallet popup. Users hear urgent claims in X Spaces, Discord AMAs, Telegram voice notes, community chats, DMs, or fake support calls. An AI agent may turn that social pressure into paid MCP calls, x402-style payments, signatures, token approvals, delegation, or repeated tool loops.

SafeIntent receives three inputs: social context, the user's natural-language safety mandate, and the agent's planned actions. It detects persuasion and missing-proof signals, compiles user rules into machine-readable policy, checks wallet, payment, and tool conflicts, and returns an explainable ALLOW, WARN, ASK_MORE, or BLOCK decision.

The MVP includes four modules:
1. Social Context - detects urgency, persuasion, missing proof, and requested wallet actions.
2. Mandate Compiler - converts spoken or written user constraints into execution policy.
3. Loop Guard - catches paid MCP loops, tool poisoning, and read-only tasks drifting into signing or approval.
4. Intent Receipt - returns the decision, exact conflicts, risk score, and a safer rewrite.

SafeIntent does not execute transactions, request private keys or seed phrases, provide financial advice, or claim that a project is guaranteed safe. It operates as a deterministic, callable guard layer that other agents can invoke before execution.
```

## Hackathon Progress

```text
During this hackathon, SafeIntent LoopGuard progressed from product research and architecture design to a complete, deployed MVP.

Completed work:
- Defined the product as an OKX.AI ASP / A2MCP-shaped pre-execution guard.
- Built a shared deterministic TypeScript policy engine.
- Implemented social-risk detection, mandate compilation, paid-loop detection, wallet-action checks, tool-output injection checks, risk scoring, safe rewrite generation, and Intent-to-Action Receipts.
- Added three verified demo scenarios: fake urgent airdrop (BLOCK 100), paid MCP loop (ASK_MORE 34), and tool-poisoning drift (BLOCK 98).
- Exposed ASP-shaped JSON endpoints for health, scenarios, manifest, social-risk intake, mandate compilation, guard checks, and receipts.
- Built and refined a responsive React/Vite frontend with four interactive modules, generated hero media, a guard-action typewriter effect, modal detail views, and mobile and short-screen support.
- Deployed the current build to Cloudflare Pages.
- Completed desktop and mobile production QA, API smoke tests, sensitive-information scans, and deterministic engine tests.
- Re-recorded a 59-second demo from the current build with English narration, burned-in subtitles, and all four modules.

Current MVP:
https://safeintent-loopguard.pages.dev/
```

## Funding Status

```text
Bootstrapped / No external funding.

SafeIntent LoopGuard is currently an independently developed hackathon MVP. It has not raised external capital, issued a token, or accepted institutional investment. The next step is to validate agent integrations and a pay-per-guard-check or pay-per-full-receipt business model.
```

## Current Hackathon

```text
OKX.AI Genesis Hackathon
```

## Hackathon Exploration

```text
This project explores how an Agent Service Provider can preserve user intent before autonomous execution. The focus is the emerging risk boundary between Web3 social persuasion, MCP and A2MCP tool use, x402-style paid calls, agent loops, and agentic wallet permissions. The MVP tests whether deterministic policy compilation and explainable receipts can become a reusable safety service for other OKX.AI agents.
```

## Milestones

```text
1. Research and positioning completed.
2. Detailed product and technical plan completed.
3. Deterministic guard engine and three scenarios completed.
4. ASP-shaped API and manifest completed.
5. Responsive interactive frontend completed.
6. Cloudflare production deployment completed.
7. English narrated and subtitled demo completed.
8. Build, API, browser, media, package, and sensitive-data QA completed.
```

## Team

For a solo submission:

```text
Solo builder
```

Role:

```text
Product strategy, UX/UI design, frontend and backend implementation, policy-engine design, testing, deployment, and demo production.
```

## Deployment Details

### Public Deployment

```text
Production frontend:
https://safeintent-loopguard.pages.dev/

Latest Cloudflare deployment:
https://6729f2ac.safeintent-loopguard.pages.dev/

Cloudflare Pages project:
safeintent-loopguard
```

### Hackathon-Compliant Ecosystem Deployment

The current version is a Web and ASP-shaped MVP without a live on-chain smart-contract deployment. Do not fabricate a testnet, mainnet, or contract address.

Recommended answer:

```text
Ecosystem deployed: No on-chain deployment

Details:
The current hackathon MVP is deployed as a production web application on Cloudflare Pages. It includes an ASP-shaped local API and mock-compatible x402/A2MCP metadata, but it does not deploy or execute a smart contract and does not submit wallet transactions.

Deployment:
https://safeintent-loopguard.pages.dev/
```

If the ecosystem field is mandatory, select:

```text
Other / OKX.AI
```

If the testnet/mainnet field is mandatory, do not make a false selection. Confirm whether the organizer accepts an ASP submission without a smart contract. Leave the contract field empty or enter:

```text
N/A - no smart contract deployed
```
