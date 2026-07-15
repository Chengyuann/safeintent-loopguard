# SafeIntent LoopGuard Submission Package

## Current Status

SafeIntent LoopGuard is ready as a local hackathon MVP package:

- Live Cloudflare Pages deployment is available.
- One-screen web demo with generated hero video.
- Responsive guard-action typewriter line beneath the stable brand title.
- Four clickable modules: Social Context, Mandate Compiler, Loop Guard, Intent Receipt.
- Details appear only after a module is clicked.
- Deterministic shared policy engine.
- Local ASP-shaped API server.
- ASP listing copy, API docs, submission answers, and 90-second demo script.
- A fully re-recorded 59-second demo has been generated from the current production build.

## Local Demo Commands

Install:

```bash
npm install
```

Run web demo:

```bash
npm run dev
```

Run API server:

```bash
npm run dev:server
```

Run verification:

```bash
npm run verify
```

If port `8787` is occupied:

```bash
PORT=8788 npm run dev:server
```

## Live Demo

Production URL:

```text
https://safeintent-loopguard.pages.dev/
```

Deployment preview URL:

```text
https://6729f2ac.safeintent-loopguard.pages.dev/
```

Cloudflare project:

```text
safeintent-loopguard
```

## Key Files

- `README.md` - project overview and run instructions.
- `docs/SUBMISSION.md` - paste-ready submission copy.
- `docs/ASP_MANIFEST.md` - OKX.AI ASP listing and tool definition.
- `docs/API_REFERENCE.md` - endpoint reference.
- `docs/DEMO_SCRIPT.md` - 90-second recording script.
- `docs/DEVIATIONS.md` - conservative implementation deviations.
- `shared/src/aspManifest.ts` - manifest object served by the API.
- `shared/src/data/scenarios.ts` - bundled demo scenarios.
- `server/src/index.ts` - local JSON API server.
- `app/public/media/safeintent-hero-loop.mp4` - web-safe generated hero video.
- `app/public/media/safeintent-hero-poster.jpg` - poster image.

## Suggested Demo Recording Flow

1. Open the homepage.
2. Briefly show the cinematic one-screen module layout.
3. Click `Social Context` and show fake airdrop social pressure.
4. Click `Mandate Compiler` and show the user's constraints.
5. Click `Loop Guard` and show the risky agent plan.
6. Click `Intent Receipt` and show `BLOCK`, conflicts, and safer rewrite.
7. Optionally switch to `Paid MCP loop` and show `ASK_MORE`.

Keep the final video under 90 seconds.

## Browser QA Evidence

Recent viewport-fit checks:

- `outputs/checks/final-fit-wide-low.png`
- `outputs/checks/final-fit-laptop-small.png`
- `outputs/checks/final-fit-desktop-short.png`
- `outputs/checks/final-fit-mobile-very-short.png`

Recent safe previews:

- `outputs/checks/final-fit-laptop-small.codex-preview.jpg`
- `outputs/checks/final-fit-desktop-short.codex-preview.jpg`
- `outputs/checks/final-fit-mobile-very-short.codex-preview.jpg`
- `outputs/checks/typewriter-desktop.codex-preview.jpg`
- `outputs/checks/typewriter-mobile.codex-preview.jpg`

Production preview checks:

- `outputs/checks/prod-desktop.png`
- `outputs/checks/prod-small.png`
- `outputs/checks/prod-mobile.png`
- `outputs/checks/prod-desktop.codex-preview.jpg`
- `outputs/checks/prod-small.codex-preview.jpg`

Cloudflare production checks:

- `outputs/checks/cloudflare-prod-desktop.png`
- `outputs/checks/cloudflare-prod-small.png`
- `outputs/checks/cloudflare-prod-mobile.png`
- `outputs/checks/cloudflare-preview-desktop.png`

Verified on production preview:

- Title is `SafeIntent LoopGuard`.
- Hero video loads and plays muted/looped.
- Homepage has four module cards.
- No details overlay appears before click.
- Clicking `Intent Receipt` opens the correct detail overlay.
- Tested at `1440x900`, `900x560`, and `390x620`.

Verified on Cloudflare production:

- Production URL loaded at `https://safeintent-loopguard.pages.dev/`.
- Latest deployment preview URL loaded at `https://6729f2ac.safeintent-loopguard.pages.dev/`.
- Production served `index-DDEHhOaL.js` and `index-C9pvfr32.css`.
- Guard-action typewriter text rendered and advanced without changing the reserved layout width.
- Normal viewports show the full prefix; short viewports use the compact `guard:` label.
- Reduced-motion support returns a static first phrase and hides the blinking cursor.
- Hero video loaded from `/media/safeintent-hero-loop.mp4`.
- Video was ready, muted, looped, and playing.
- Four module cards were present.
- No detail overlay appeared before click.
- Clicking `Intent Receipt` opened the correct detail overlay.
- No failed requests or 4xx/5xx responses were observed in browser QA.
- Responsive typewriter QA passed at `1440x900`, `1280x720`, `900x560`, `390x844`, and `390x620`, with no horizontal or vertical page overflow.

## Demo Recording

Generated files:

- `outputs/demo-recording/safeintent-loopguard-demo-voiceover-subtitles.mp4`
- `outputs/demo-recording/safeintent-loopguard-demo-voiceover.mp4`
- `outputs/demo-recording/tts/safeintent-voiceover.mp3`
- `outputs/demo-recording/tts/safeintent-loopguard-demo-voiceover.srt`
- `outputs/demo-recording/safeintent-loopguard-demo.mp4`
- `outputs/demo-recording/safeintent-loopguard-demo-cover.jpg`
- `outputs/demo-recording/safeintent-loopguard-demo-cover.codex-preview.jpg`

Recommended submitted video:

- `outputs/demo-recording/safeintent-loopguard-demo-voiceover-subtitles.mp4`

Voiceover/subtitle video properties:

- Duration: 59.08 seconds.
- Resolution: 1440x900.
- Video codec: H.264.
- Audio codec: AAC.
- Includes English TTS narration.
- Includes burned-in English subtitles.
- Size: about 8.0 MiB.
- Under the 90-second demo limit.
- Re-recorded after the guard-action typewriter update; it does not loop the older 34.84-second screen capture.
- The timeline now matches the narration: current homepage/typewriter, Social Context, Mandate Compiler, Loop Guard, Intent Receipt with conflict/rewrite scrolling, then the current homepage closing shot.
- Uses a subtle cyan pointer ring in the recording to make module navigation clear to judges.

Current silent recording properties:

- Duration: 59.08 seconds.
- Resolution: 1440x900.
- Codec: H.264.
- Audio: none.
- Size: about 8.0 MiB.
- Under the 90-second demo limit.

The recording flow shows the current homepage and typewriter effect, then opens Social Context, Mandate Compiler, Loop Guard, and Intent Receipt. The receipt view scrolls through the decision evidence and safer rewrite before returning to the current homepage.

Recording QA:

- Video stream starts at `0.000` and lasts `59.080` seconds.
- Audio stream starts at `0.000` and lasts `59.064` seconds.
- Full decode passed with no errors.
- No black frames or unexpected long silence were detected.
- Integrated loudness is approximately `-17.5 LUFS`.
- MP4 `moov` atom precedes `mdat` (`faststart` enabled).
- Final SHA-256: `506b0e6dc164afd68f2146981e653e6a0d07d9cc6a80fc02574dbc05352a8a4d`.

## API Smoke Test

After starting the API server:

```bash
curl http://127.0.0.1:8787/api/health
curl http://127.0.0.1:8787/api/asp/manifest
curl http://127.0.0.1:8787/api/scenarios
```

Run a full guard check with the bundled scenario by using the web demo or posting the scenario input to:

```http
POST /api/guard/check
```

Latest local smoke result on `PORT=8788`:

```json
{
  "health": {
    "ok": true,
    "service": "SafeIntent LoopGuard",
    "version": "0.1.0"
  },
  "manifest": {
    "name": "SafeIntent LoopGuard",
    "categories": ["Software Utility", "Finance Copilot", "Creative Genius"],
    "tool_count": 3,
    "x402_ready": true
  },
  "guard_check": {
    "decision": "BLOCK",
    "risk_score": 100,
    "conflict_count": 8,
    "first_conflict": "urgency_detected",
    "rewrite_count": 7
  }
}
```

## Submission Copy

Use `docs/SUBMISSION.md` for:

- Project description.
- Novelty explanation.
- Technical description.
- Revenue model.
- Safety boundary.
- X post draft with `#OKXAI`.

Use `docs/ASP_MANIFEST.md` for:

- Store/listing description.
- Tool definition.
- Endpoint shape.
- Example input/output.

## User-only Steps

These require account/session access and should be completed manually:

- Publish or host the demo URL if a public URL is required.
- Record and upload the under-90-second demo video.
- Submit the Google Form.
- Post on X with `#OKXAI`.
- Complete OKX.AI ASP listing/review/onboarding steps.

## Cloudflare Pages Deployment

Deployment is complete.

Prepared config:

- `wrangler.toml`

Commands used:

```bash
npm run build
npx wrangler pages project create safeintent-loopguard --production-branch main
npx wrangler pages deploy dist --project-name safeintent-loopguard --commit-dirty=true --branch main
```

Production URL:

```text
https://safeintent-loopguard.pages.dev/
```

## Safety Boundary

SafeIntent does not:

- Execute wallet actions.
- Ask for private keys or seed phrases.
- Provide financial advice.
- Claim a project is guaranteed safe.

It only returns pre-execution policy decisions, conflict evidence, safer rewrite suggestions, and an execution receipt.
