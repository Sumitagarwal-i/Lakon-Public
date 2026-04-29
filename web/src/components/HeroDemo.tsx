"use client";

import { useState, useEffect, useRef } from "react";

const BEFORE = "Hey! I was wondering if you could help me out. I'm a backend developer and I need to understand the differences between PostgreSQL and MongoDB. I've already read the basics so you don't need to explain what databases are. I mainly want to know when I should pick one over the other for a new project. Maybe a table comparing them would be nice? Thanks so much!";
const AFTER = "Compare PostgreSQL vs MongoDB: when to use each for new projects. Skip fundamentals. Include decision table.";

const BEFORE_TOKENS = 76;
const AFTER_TOKENS = 17;

type Phase =
  | "typing-before"
  | "pause-before"
  | "compressing"
  | "typing-after"
  | "done"
  | "fadeout";

export default function HeroDemo() {
  const [phase, setPhase] = useState<Phase>("typing-before");
  const [beforeText, setBeforeText] = useState("");
  const [afterText, setAfterText] = useState("");
  const [displayTokens, setDisplayTokens] = useState(BEFORE_TOKENS);
  const [opacity, setOpacity] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useRef(false);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = () => timeouts.current.forEach(clearTimeout);

  const delay = (ms: number) =>
    new Promise<void>((res) => {
      const t = setTimeout(res, ms);
      timeouts.current.push(t);
    });

  const runCycle = async () => {
    // Reset
    setBeforeText("");
    setAfterText("");
    setDisplayTokens(BEFORE_TOKENS);
    setPhase("typing-before");
    setOpacity(1);

    // Type BEFORE text
    for (let i = 0; i <= BEFORE.length; i++) {
      setBeforeText(BEFORE.slice(0, i));
      await delay(18);
    }

    // Pause so user can read
    setPhase("pause-before");
    await delay(800);

    // Compressing phase
    setPhase("compressing");
    await delay(1200);

    // Animate tokens down
    setPhase("typing-after");
    const steps = 30;
    const diff = BEFORE_TOKENS - AFTER_TOKENS;
    for (let s = 0; s <= steps; s++) {
      setDisplayTokens(Math.round(BEFORE_TOKENS - (diff * s) / steps));
      await delay(25);
    }

    // Type AFTER text fast
    for (let i = 0; i <= AFTER.length; i++) {
      setAfterText(AFTER.slice(0, i));
      await delay(12);
    }

    // Done — show result
    setPhase("done");
    await delay(4000);

    // Fade out
    setPhase("fadeout");
    setOpacity(0);
    await delay(500);

    // Restart
    runCycle();
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible.current) {
          isVisible.current = true;
          runCycle();
        }
      },
      { threshold: 0.3 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pct = Math.round(((BEFORE_TOKENS - displayTokens) / BEFORE_TOKENS) * 100);
  const mono = { fontFamily: "var(--font-jetbrains-mono), monospace" };

  return (
    <div
      ref={containerRef}
      style={{
        transition: "opacity 0.5s ease",
        opacity,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        overflow: "hidden",
        width: "100%",
        maxWidth: "720px",
        margin: "0 auto",
      }}
    >
      {/* Title bar */}
      <div style={{
        background: "var(--surface-2)",
        borderBottom: "1px solid var(--border)",
        height: "36px",
        display: "flex",
        alignItems: "center",
        padding: "0 14px",
        gap: "6px",
      }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF5F57" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FEBC2E" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28C840" }} />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
        
          <span style={{ ...mono, fontSize: "10px", color: "var(--text-3)" }}>Lakon — live demo</span>
        </div>
        <div style={{ ...mono, fontSize: "10px", color: phase === "compressing" ? "var(--amber)" : phase === "done" ? "var(--green)" : "var(--text-3)" }}>
          {phase === "typing-before" || phase === "pause-before" ? "ready" : phase === "compressing" ? "compressing..." : phase === "done" || phase === "typing-after" ? "done ✓" : ""}
        </div>
      </div>

      {/* Two panels */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr" }}>
        {/* BEFORE panel */}
        <div style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ ...mono, fontSize: "10px", color: "var(--text-3)", letterSpacing: "0.1em" }}>BEFORE</span>
            <span style={{ ...mono, fontSize: "11px", color: phase === "done" ? "rgba(239,68,68,0.6)" : "var(--text-2)" }}>
              {BEFORE_TOKENS} tokens
            </span>
          </div>
          <div style={{
            ...mono,
            fontSize: "12px",
            lineHeight: 1.7,
            color: phase === "done" ? "rgba(255,255,255,0.25)" : "var(--text-2)",
            minHeight: "120px",
            transition: "color 0.4s",
          }}>
            {beforeText}
            {(phase === "typing-before") && (
              <span style={{ borderRight: "1px solid var(--text-2)", marginLeft: "1px", animation: "blink 1s step-end infinite" }} />
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={{ background: "var(--border)" }} />

        {/* AFTER panel */}
        <div style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ ...mono, fontSize: "10px", color: "var(--text-3)", letterSpacing: "0.1em" }}>AFTER</span>
            {(phase === "typing-after" || phase === "done") && (
              <span style={{ ...mono, fontSize: "11px", color: "var(--green)" }}>
                {displayTokens} tokens
              </span>
            )}
          </div>

          {phase === "compressing" ? (
            <div style={{ minHeight: "120px", display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "12px", height: "12px",
                border: "1.5px solid var(--border)",
                borderTopColor: "var(--green)",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
              }} />
              <span style={{ ...mono, fontSize: "12px", color: "var(--text-3)" }}>compressing...</span>
            </div>
          ) : (
            <div style={{
              ...mono,
              fontSize: "12px",
              lineHeight: 1.7,
              color: "var(--green)",
              minHeight: "120px",
            }}>
              {afterText}
              {phase === "typing-after" && (
                <span style={{ borderRight: "1px solid var(--green)", marginLeft: "1px", animation: "blink 0.7s step-end infinite" }} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats footer */}
      <div style={{
        borderTop: "1px solid var(--border)",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        opacity: phase === "done" || phase === "typing-after" ? 1 : 0,
        transition: "opacity 0.3s",
      }}>
        <span style={{ ...mono, fontSize: "11px", color: "var(--text-2)" }}>
          {BEFORE_TOKENS} → {displayTokens} tokens
        </span>
        <span style={{ ...mono, fontSize: "11px", color: "var(--green)", fontWeight: 600 }}>
          {pct > 0 ? `${pct}% saved` : ""}
        </span>
        <span style={{ ...mono, fontSize: "11px", color: "var(--text-3)" }}>intent preserved ✓</span>
      </div>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
