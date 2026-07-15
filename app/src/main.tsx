import React from "react";
import ReactDOM from "react-dom/client";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  ChevronDown,
  FileJson,
  Fingerprint,
  Mic2,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  WalletCards,
  Waves,
  Zap
} from "lucide-react";
import { demoScenarios, runGuard, type AgentPlanStep, type Decision, type GuardInput } from "@shared";
import "./styles.css";

const decisionLabel: Record<Decision, string> = {
  ALLOW: "Allow",
  WARN: "Warn",
  ASK_MORE: "Ask More",
  BLOCK: "Block"
};

const guardedActions = [
  "spends without proof.",
  "signs beyond intent.",
  "approves unsafe access.",
  "pays a poisoned tool.",
  "loops past the mandate."
] as const;

const moduleCards = [
  {
    id: "social-context",
    index: "01",
    title: "Social Context",
    label: "Voice and community signal",
    body: "Extract urgency, persuasion, missing proof, and requested wallet action."
  },
  {
    id: "mandate-compiler",
    index: "02",
    title: "Mandate Compiler",
    label: "User rules to policy",
    body: "Compile spoken constraints into payment, approval, wallet, and ask-before rules."
  },
  {
    id: "loop-guard",
    index: "03",
    title: "Loop Guard",
    label: "Agent plan inspection",
    body: "Catch paid MCP loops, tool poisoning, and read-only tasks drifting into signing."
  },
  {
    id: "intent-receipt",
    index: "04",
    title: "Intent Receipt",
    label: "Decision with evidence",
    body: "Return ALLOW, WARN, ASK_MORE, or BLOCK with conflicts and a safer rewrite."
  }
] as const;

function App() {
  const [scenarioId, setScenarioId] = React.useState(demoScenarios[0].id);
  const [activeModuleId, setActiveModuleId] = React.useState<(typeof moduleCards)[number]["id"] | null>(null);
  const selectedScenario = demoScenarios.find((scenario) => scenario.id === scenarioId) ?? demoScenarios[0];
  const [draft, setDraft] = React.useState<GuardInput>(selectedScenario.input);
  const [planText, setPlanText] = React.useState(formatJson(selectedScenario.input.agent_plan));

  React.useEffect(() => {
    setDraft(selectedScenario.input);
    setPlanText(formatJson(selectedScenario.input.agent_plan));
  }, [selectedScenario]);

  const parsedPlanState = React.useMemo(() => {
    try {
      const parsedPlan = JSON.parse(planText) as AgentPlanStep[];
      return { plan: parsedPlan, error: null as string | null };
    } catch (error) {
      return { plan: draft.agent_plan, error: error instanceof Error ? error.message : String(error) };
    }
  }, [draft.agent_plan, planText]);

  const result = React.useMemo(() => {
    return runGuard({ ...draft, agent_plan: parsedPlanState.plan });
  }, [draft, parsedPlanState.plan]);

  const jsonError = parsedPlanState.error;
  const updateDraft = (patch: Partial<GuardInput>) => setDraft((current) => ({ ...current, ...patch }));

  return (
    <main className="page">
      <Hero
        decision={result.decision}
        riskScore={result.risk_score}
        scenarioId={scenarioId}
        setScenarioId={setScenarioId}
        conflictCount={result.conflicts.length}
        paidUsage={result.diagnostics.total_paid_usd}
        modules={moduleCards}
        openModule={setActiveModuleId}
      />

      {activeModuleId ? (
        <section className="detailOverlay" role="dialog" aria-modal="true" aria-label="SafeIntent module details">
          <button className="overlayBackdrop" aria-label="Close module details" onClick={() => setActiveModuleId(null)} />
          <div className="detailShell">
            <div className="labHeader">
              <div>
                <span className="sectionKicker">Module Details</span>
                <h2>{moduleCards.find((module) => module.id === activeModuleId)?.title}</h2>
              </div>
              <div className="overlayActions">
                <div className={`miniDecision ${result.decision.toLowerCase()}`}>
                  <ShieldCheck size={18} />
                  <span>{result.decision}</span>
                  <strong>{result.risk_score}</strong>
                </div>
                <button className="closeButton" onClick={() => setActiveModuleId(null)}>Close</button>
              </div>
            </div>

            <div className="scenarioStrip" aria-label="Demo scenario selector">
              {demoScenarios.map((scenario, index) => (
                <button
                  key={scenario.id}
                  className={scenario.id === scenarioId ? "scenarioPill active" : "scenarioPill"}
                  onClick={() => setScenarioId(scenario.id)}
                >
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  <span>{scenario.title}</span>
                  <em>{scenario.expected_decision}</em>
                </button>
              ))}
            </div>

            <section className="moduleDetailStack">
              {activeModuleId === "social-context" ? (
                <Panel icon={<Mic2 size={18} />} title="1. Social Voice Context" accent="cyan">
                  <Label text="User goal" />
                  <input
                    value={draft.user_goal}
                    onChange={(event) => updateDraft({ user_goal: event.target.value })}
                  />
                  <Label text="Transcript or social text" />
                  <textarea
                    className="large"
                    value={draft.social_context.text}
                    onChange={(event) => updateDraft({ social_context: { ...draft.social_context, text: event.target.value } })}
                  />
                  <div className="riskList">
                    {result.social_risks.length === 0 ? (
                      <StatusLine tone="ok" text="No social-risk signal detected." />
                    ) : result.social_risks.map((risk) => (
                      <StatusLine key={risk.code} tone="risk" text={`${risk.label}: ${risk.evidence}`} />
                    ))}
                  </div>
                </Panel>
              ) : null}

              {activeModuleId === "mandate-compiler" ? (
                <Panel icon={<WalletCards size={18} />} title="2. Mandate Compiler" accent="violet">
                  <div className="detailColumns">
                    <div>
                      <Label text="User mandate" />
                      <textarea
                        value={draft.user_mandate_text}
                        onChange={(event) => updateDraft({ user_mandate_text: event.target.value })}
                      />
                    </div>
                    <div>
                      <Label text="Compiled policy" />
                      <div className="policyGrid tall">
                        <MiniMetric label="Paid budget" value={`$${result.mandate.payment_policy.max_total_usd}`} />
                        <MiniMetric label="Per call" value={`$${result.mandate.payment_policy.max_single_call_usd}`} />
                        <MiniMetric label="Repeat cap" value={`${result.mandate.payment_policy.max_repeated_calls_per_tool}x`} />
                      </div>
                    </div>
                  </div>
                </Panel>
              ) : null}

              {activeModuleId === "loop-guard" ? (
                <Panel icon={<Zap size={18} />} title="3. Agent Loop Guard" accent="cyan">
                  <Label text="Agent plan JSON" />
                  <textarea
                    className="codeBox"
                    value={planText}
                    onChange={(event) => setPlanText(event.target.value)}
                  />
                  {jsonError ? <StatusLine tone="risk" text={`Plan JSON error: ${jsonError}`} /> : null}
                </Panel>
              ) : null}

              {activeModuleId === "intent-receipt" ? (
                <Panel icon={<ReceiptText size={18} />} title="4. Decision + Receipt" accent="amber">
                  <div className={`resultHero ${result.decision.toLowerCase()}`}>
                    <div>
                      <span>Decision</span>
                      <strong>{result.decision}</strong>
                    </div>
                    <div>
                      <span>Risk Score</span>
                      <strong>{result.risk_score}</strong>
                    </div>
                  </div>
                  <p className="summary">{result.summary}</p>

                  <SectionTitle icon={<AlertTriangle size={16} />} text="Conflicts" />
                  <div className="conflicts">
                    {result.conflicts.map((conflict) => (
                      <article key={`${conflict.code}-${conflict.evidence}`} className="conflict">
                        <div>
                          <strong>{conflict.label}</strong>
                          <span>{conflict.code}</span>
                        </div>
                        <p>{conflict.evidence}</p>
                      </article>
                    ))}
                  </div>

                  <SectionTitle icon={<RefreshCw size={16} />} text="Safe Rewrite" />
                  <ul className="rewriteList">
                    {result.safe_rewrite.map((item) => <li key={item}>{item}</li>)}
                  </ul>

                  <SectionTitle icon={<FileJson size={16} />} text="Intent Receipt" />
                  <pre className="receipt">{formatJson(result.receipt)}</pre>
                </Panel>
              ) : null}
            </section>

            <footer className="footer">
              <div>
                <Bot size={16} />
                A2MCP-shaped ASP demo: transcript-first voice context, deterministic guard engine, x402-ready metadata.
              </div>
              <div>
                <CheckCircle2 size={16} />
                No wallet execution, no private keys, no financial advice.
              </div>
            </footer>
          </div>
        </section>
      ) : null}
    </main>
  );
}

function Hero({
  decision,
  riskScore,
  scenarioId,
  setScenarioId,
  conflictCount,
  paidUsage,
  modules,
  openModule
}: {
  decision: Decision;
  riskScore: number;
  scenarioId: string;
  setScenarioId: (value: string) => void;
  conflictCount: number;
  paidUsage: number;
  modules: typeof moduleCards;
  openModule: (moduleId: (typeof moduleCards)[number]["id"]) => void;
}) {
  const activeScenario = demoScenarios.find((scenario) => scenario.id === scenarioId) ?? demoScenarios[0];
  const heroRef = React.useRef<HTMLElement | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const pointerFrame = React.useRef(0);
  const guardedAction = useTypewriter(guardedActions);

  const updatePointer = React.useCallback((event: React.PointerEvent<HTMLElement>) => {
    const target = heroRef.current;
    if (!target || pointerFrame.current) {
      return;
    }

    const rect = target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    pointerFrame.current = window.requestAnimationFrame(() => {
      target.style.setProperty("--pointer-x", `${x.toFixed(2)}%`);
      target.style.setProperty("--pointer-y", `${y.toFixed(2)}%`);
      pointerFrame.current = 0;
    });
  }, []);

  React.useEffect(() => {
    return () => {
      if (pointerFrame.current) {
        window.cancelAnimationFrame(pointerFrame.current);
      }
    };
  }, []);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return undefined;
    }

    video.muted = true;
    video.playsInline = true;

    const tryPlay = () => {
      void video.play().catch(() => {
        // Keep the poster visible if a browser delays autoplay.
      });
    };

    tryPlay();
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);

    return () => {
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
    };
  }, []);

  return (
    <section ref={heroRef} className={`hero ${decision.toLowerCase()}`} onPointerMove={updatePointer}>
      <video
        ref={videoRef}
        className="heroVideo"
        src="/media/safeintent-hero-loop.mp4"
        poster="/media/safeintent-hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="heroVideoVeil" />
      <ShaderBackdrop decision={decision} />
      <div className="heroGrain" />
      <div className="heroScanlines" />
      <div className="pointerAura" />
      <div className="stageNumbers" aria-hidden="true">
        <span>00</span>
        <span>17</span>
        <span>42</span>
        <span>90</span>
      </div>
      <nav className="heroNav" aria-label="SafeIntent navigation">
        <div className="brandMark">
          <Fingerprint size={18} />
          <span>SafeIntent</span>
        </div>
        <div className="navPills">
          <span>OKX.AI ASP</span>
          <span>Agentic wallet</span>
          <span>Intent firewall</span>
        </div>
        <button className="navAction" onClick={() => openModule("social-context")}>Open lab</button>
      </nav>

      <div className="heroStage">
        <div className="heroCopy">
          <div className="heroKicker">
            <Waves size={16} />
            Social signal to execution policy
          </div>
          <h1>
            <span>SafeIntent</span>
            <span>LoopGuard</span>
          </h1>
          <p
            className="heroTypeLine"
            aria-label="Stops the agent before it spends without proof, signs beyond intent, approves unsafe access, pays a poisoned tool, or loops past the mandate."
          >
            <span className="typewriterPrefix" aria-hidden="true">Stops the agent before it</span>
            <span className="typewriterSlot" aria-hidden="true">
              <span className="typewriterText">{guardedAction}</span>
              <span className="typewriterCursor">_</span>
            </span>
          </p>
          <div className="kineticStrip" aria-label="SafeIntent signal path">
            <span>voice</span>
            <span>policy</span>
            <span>wallet</span>
            <span>loop</span>
          </div>
        </div>

        <div className={`intentCore ${decision.toLowerCase()}`} aria-label={`Current guard decision ${decision}`}>
          <div className="coreMesh" />
          <div className="coreOrbit coreOrbitOne" />
          <div className="coreOrbit coreOrbitTwo" />
          <div className="coreOrbit coreOrbitThree" />
          <div className="coreRay coreRayOne" />
          <div className="coreRay coreRayTwo" />
          <div className="coreRay coreRayThree" />
          <div className="floatingNode nodeVoice"><span>voice</span></div>
          <div className="floatingNode nodePolicy"><span>policy</span></div>
          <div className="floatingNode nodeWallet"><span>wallet</span></div>
          <div className="centerCore">
            <ShieldCheck size={30} />
            <span>{decisionLabel[decision]}</span>
            <strong>{riskScore}</strong>
          </div>
          <div className="coreReadout">
            <span>{conflictCount} conflicts</span>
            <span>${paidUsage.toFixed(1)} paid loop</span>
          </div>
        </div>
      </div>

      <div className="heroDock">
        <div className="dockHeading">
          <span>Explore modules</span>
          <strong>{activeScenario.title}</strong>
        </div>
        <div className="moduleDeck">
          {modules.map((module) => (
            <button key={module.id} className="moduleCard" onClick={() => openModule(module.id)}>
              <small>{module.index}</small>
              <strong>{module.title}</strong>
              <span>{module.label}</span>
              <p>{module.body}</p>
            </button>
          ))}
        </div>
        <div className="telemetry">
          <Telemetry icon={<AlertTriangle size={15} />} label="conflicts" value={conflictCount} />
          <Telemetry icon={<Zap size={15} />} label="paid loop" value={`$${paidUsage.toFixed(1)}`} />
          <Telemetry icon={<Waves size={15} />} label="voice layer" value="active" />
        </div>
      </div>

      <a className="scrollCue" href="#lab" aria-label="Scroll to interactive guard lab">
        <ChevronDown size={22} />
      </a>
    </section>
  );
}

function useTypewriter(phrases: readonly string[]) {
  const [phraseIndex, setPhraseIndex] = React.useState(0);
  const [characterIndex, setCharacterIndex] = React.useState(0);
  const [deleting, setDeleting] = React.useState(false);
  const [pageVisible, setPageVisible] = React.useState(() => typeof document === "undefined" || !document.hidden);
  const [reduceMotion, setReduceMotion] = React.useState(() => {
    return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleVisibility = () => setPageVisible(!document.hidden);
    const handleMotionPreference = () => setReduceMotion(mediaQuery.matches);

    document.addEventListener("visibilitychange", handleVisibility);
    mediaQuery.addEventListener("change", handleMotionPreference);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      mediaQuery.removeEventListener("change", handleMotionPreference);
    };
  }, []);

  React.useEffect(() => {
    if (reduceMotion || !pageVisible || phrases.length === 0) {
      return undefined;
    }

    const phrase = phrases[phraseIndex] ?? phrases[0];
    let delay = 0;
    let nextStep: () => void;

    if (!deleting && characterIndex < phrase.length) {
      delay = 46 + Math.random() * 54;
      nextStep = () => setCharacterIndex((current) => current + 1);
    } else if (!deleting) {
      delay = 980;
      nextStep = () => setDeleting(true);
    } else if (characterIndex > 0) {
      delay = 24 + Math.random() * 28;
      nextStep = () => setCharacterIndex((current) => current - 1);
    } else {
      delay = 220;
      nextStep = () => {
        setPhraseIndex((current) => (current + 1) % phrases.length);
        setDeleting(false);
      };
    }

    const timeout = window.setTimeout(nextStep, delay);
    return () => window.clearTimeout(timeout);
  }, [characterIndex, deleting, pageVisible, phraseIndex, phrases, reduceMotion]);

  if (phrases.length === 0) {
    return "";
  }

  if (reduceMotion) {
    return phrases[0];
  }

  const phrase = phrases[phraseIndex] ?? phrases[0];
  return phrase.slice(0, characterIndex);
}

function ShaderBackdrop({ decision }: { decision: Decision }) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const gl = canvas.getContext("webgl", { antialias: true, alpha: false, preserveDrawingBuffer: true });
    if (!gl) {
      return undefined;
    }

    const vertexSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_alert;

      mat2 rot(float a) {
        float s = sin(a);
        float c = cos(a);
        return mat2(c, -s, s, c);
      }

      float grid(vec2 uv, float scale) {
        vec2 g = abs(fract(uv * scale) - 0.5);
        float line = min(g.x, g.y);
        return 1.0 - smoothstep(0.0, 0.018, line);
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        vec2 p = uv;
        p *= rot(0.24 + sin(u_time * 0.08) * 0.08);

        float wave = 0.0;
        for (float i = 1.0; i < 6.0; i += 1.0) {
          vec2 q = p * (0.8 + i * 0.22);
          q.x += sin(q.y * (1.5 + i * 0.25) + u_time * (0.38 + i * 0.04)) * 0.24;
          q.y += cos(q.x * (1.2 + i * 0.2) - u_time * (0.32 + i * 0.05)) * 0.18;
          wave += 0.018 / abs(sin(q.x + q.y + u_time * 0.12) + cos(q.x * 0.78 - q.y) * 0.72);
        }

        vec2 leftCore = uv - vec2(-0.52, 0.02);
        vec2 rightCore = uv - vec2(0.64, -0.08);
        float leftField = 0.034 / max(abs(sin(leftCore.x * 2.4 + u_time * 0.4) + cos(leftCore.y * 2.1 - u_time * 0.26)), 0.08);
        float rightField = 0.026 / max(abs(sin(rightCore.y * 2.9 - u_time * 0.32) + cos(rightCore.x * 1.8 + u_time * 0.2)), 0.08);
        float ring = abs(length(uv - vec2(0.5, -0.02)) - 0.56);
        float ringGlow = 0.02 / max(ring, 0.018);
        float scan = smoothstep(0.018, 0.0, abs(fract((uv.y + u_time * 0.07) * 7.0) - 0.5));
        float gridLine = grid(p + vec2(u_time * 0.01, -u_time * 0.015), 7.0);

        vec3 calmA = vec3(0.02, 0.88, 1.0);
        vec3 calmB = vec3(0.55, 0.28, 1.0);
        vec3 alertA = vec3(1.0, 0.18, 0.34);
        vec3 alertB = vec3(1.0, 0.66, 0.24);
        vec3 colorA = mix(calmA, alertA, u_alert);
        vec3 colorB = mix(calmB, alertB, u_alert);
        vec3 base = mix(vec3(0.015, 0.025, 0.055), vec3(0.01, 0.015, 0.035), length(uv));
        vec3 color = base + colorA * wave * 0.52 + colorB * ringGlow * 0.05 + colorA * scan * 0.035 + colorB * gridLine * 0.025;
        color += colorA * leftField * 0.32 + colorB * rightField * 0.24;

        float vignette = smoothstep(1.35, 0.18, length(uv));
        float alpha = clamp(vignette * 0.98, 0.0, 1.0);
        gl_FragColor = vec4(color * alpha, 1.0);
      }
    `;

    const program = createProgram(gl, vertexSource, fragmentSource);
    if (!program) {
      return undefined;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const alertLocation = gl.getUniformLocation(program, "u_alert");

    let animationFrame = 0;
    const alertValue = decision === "BLOCK" ? 1 : decision === "ASK_MORE" || decision === "WARN" ? 0.55 : 0.15;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = Math.max(window.innerHeight, 720);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const render = (time: number) => {
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, time * 0.001);
      gl.uniform1f(alertLocation, alertValue);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrame = window.requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    animationFrame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(program);
      gl.deleteBuffer(positionBuffer);
    };
  }, [decision]);

  return <canvas ref={canvasRef} className="shaderCanvas" aria-hidden="true" />;
}

function createProgram(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  const program = gl.createProgram();
  if (!program) {
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  return program;
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) {
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function Telemetry({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="telemetryItem">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Panel({ id, icon, title, accent, children }: { id?: string; icon: React.ReactNode; title: string; accent: "cyan" | "violet" | "amber"; children: React.ReactNode }) {
  return (
    <section id={id} className={`panel ${accent}`}>
      <div className="panelGlow" />
      <div className="panelTitle">
        {icon}
        <h2>{title}</h2>
        <Zap size={14} className="panelBolt" />
      </div>
      {children}
    </section>
  );
}

function Label({ text }: { text: string }) {
  return <label>{text}</label>;
}

function SectionTitle({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="sectionTitle">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function StatusLine({ tone, text }: { tone: "ok" | "risk"; text: string }) {
  return <div className={`statusLine ${tone}`}>{text}</div>;
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="miniMetric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
