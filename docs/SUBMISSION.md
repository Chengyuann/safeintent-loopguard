# Submission Draft

## Project Name

SafeIntent LoopGuard

## Tagline

Voice-aware policy guardrails for Agentic Wallet execution.

## Description

SafeIntent LoopGuard is an OKX.AI Agent Service Provider that checks whether an AI agent's planned tool calls, x402-style payments, signatures, approvals, and wallet actions still match the user's original Web3 intent and safety mandate.

Instead of treating voice as a speech-to-text shortcut, SafeIntent uses social voice and community context as part of the risk model. It inspects what the user heard in an AMA, X Space, Discord call, Telegram voice note, or support conversation, compiles the user's natural-language safety preferences into policy, and detects conflicts before the agent executes.

The demo includes a one-screen cinematic homepage with four modules: Social Context, Mandate Compiler, Loop Guard, and Intent Receipt. Clicking a module opens the relevant details only when needed, keeping the first screen clean for judges while still exposing the full policy engine.

The hero now includes a fixed-width guard-action typewriter line that cycles through the risky actions SafeIntent stops before execution: unsupported spending, intent drift, unsafe approvals, poisoned paid tools, and mandate-breaking loops. It pauses when the page is hidden and becomes static when reduced motion is enabled.

## Tracks

- Software Utility
- Finance Copilot
- Creative Genius

## Problem

Agentic wallets and paid agent tools move risk earlier than the transaction popup. A user may hear an urgent claim in a Discord AMA, ask an agent to "just check eligibility", and the agent may then follow a link, call paid tools, or prepare a wallet approval. The dangerous step starts when social persuasion becomes an executable agent task.

## Solution

SafeIntent LoopGuard accepts social context, a user mandate, and an agent plan. It detects social-risk signals, compiles the mandate into policy, checks wallet/payment/MCP/tool-loop conflicts, and returns an execution decision plus an Intent-to-Action Receipt.

## Why It Fits OKX.AI ASP

- Registered ASP Agent ID: `5848`.
- It is a callable pre-execution service for other agents.
- It has a deployed tool endpoint: `POST https://safeintent-loopguard.pages.dev/api/guard/check`.
- It supports a free preview / paid receipt pricing model.
- It is x402-ready in shape: full receipts and diagnostics can be paid outputs.
- It improves safety for finance, agentic wallet, MCP, and paid-tool workflows.

## Demo Links / Artifacts

- Live web demo: `https://safeintent-loopguard.pages.dev/`
- Latest Cloudflare deployment preview: `https://57aa0f87.safeintent-loopguard.pages.dev/`
- Production guard API: `https://safeintent-loopguard.pages.dev/api/guard/check`
- Local web demo: `npm run dev`
- Local API server: `npm run dev:server`
- ASP manifest docs: `docs/ASP_MANIFEST.md`
- API docs: `docs/API_REFERENCE.md`
- 90-second script: `docs/DEMO_SCRIPT.md`
- Browser QA screenshots: `outputs/checks/`

## X Post Draft

SafeIntent LoopGuard for #OKXAI turns Web3 social voice context and user safety mandates into a pre-execution guard for AI agents.

It detects fake airdrop pressure, MCP tool-poisoning drift, repeated paid tool loops, wallet approval conflicts, and x402-style spend risk before an agent signs, pays, or approves.

Demo: https://safeintent-loopguard.pages.dev/

## Published X Participation Post

- Account: `@macy200201`
- Post: `https://x.com/macy200201/status/2077289018283483331`

## Short X Post

Built SafeIntent LoopGuard for #OKXAI:

A pre-execution ASP that turns Web3 social voice context + user mandates into policy before AI agents spend, sign, approve, or loop.

It catches fake airdrop pressure, MCP tool poisoning, x402 spend drift, and wallet approval conflicts.

Demo: https://safeintent-loopguard.pages.dev/

## Google Form Paste-ready Answers

### Project Summary

SafeIntent LoopGuard is an OKX.AI Agent Service Provider that protects users before an AI agent spends, signs, approves, or loops. It reads Web3 social context, compiles the user's natural-language mandate into policy, checks an agent plan for wallet/payment/MCP conflicts, and returns an explainable decision plus safer rewrite.

### What Makes It Novel

SafeIntent treats voice and social context as part of the execution-risk model. It does not use voice as a basic ASR input. Instead, it captures the risky context where many Web3 decisions start: AMAs, X Spaces, Discord calls, Telegram voice notes, DMs, fake support calls, and community pressure. It then links that context to agent plans and wallet/payment constraints.

### Technical Description

The project is a TypeScript React/Vite demo plus a deployed ASP-shaped JSON API on Cloudflare Pages Functions. Shared policy logic detects social risk signals, compiles user mandates, checks wallet actions, detects repeated paid tool loops, flags tool-output instruction injection, scores risk, and emits an Intent-to-Action Receipt. The service exposes health, scenarios, ASP manifest, social-risk intake, mandate compile, guard check, and receipt endpoints.

### Revenue Model

Free preview returns a compact decision and conflict list. Paid mode returns the full Intent-to-Action Receipt, safe rewrite, policy JSON, and loop diagnostics. The natural unit is pay per guard check or per full receipt.

### Safety Boundary

SafeIntent does not execute transactions, request seed phrases or private keys, provide financial advice, or claim a project is guaranteed safe. It only returns pre-execution policy decisions and safer rewrite suggestions.
