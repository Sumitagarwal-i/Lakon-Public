/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const TASK_TYPES = [
  { value: "auto", label: "Auto" },
  { value: "coding", label: "Coding" },
  { value: "writing", label: "Writing" },
  { value: "analysis", label: "Analysis" },
  { value: "creative", label: "Creative" },
  { value: "data", label: "Data" },
];
const COMPRESSION_MODES = [
  { value: "balanced", label: "Balanced" },
  { value: "strict", label: "Strict" },
  { value: "creative", label: "Creative" },
];
const EXAMPLE = "Hey! I was wondering if you could help me out. I'm a backend developer and I need to understand the differences between PostgreSQL and MongoDB. I've already read the basics so you don't need to explain what databases are. I mainly want to know when I should pick one over the other for a new project. Maybe a table comparing them would be nice? Thanks so much!";

const mono = { fontFamily: "var(--font-jetbrains-mono), monospace" } as const;

function SelectPill({
  value, onChange, options,
}: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        ...mono,
        appearance: "none",
        background: "var(--surface-2)",
        border: "0.8px solid var(--border)",
        borderRadius: "var(--radius-pill)",
        padding: "4px 12px",
        fontSize: "11px",
        color: "var(--text-2)",
        cursor: "pointer",
        outline: "none",
        height: "26px",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--border-hover)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
    >
      {options.map(o => <option key={o.value} value={o.value} style={{ background: "var(--surface-2)" }}>{o.label}</option>)}
    </select>
  );
}

export default function AppPage() {
  const [prompt, setPrompt] = useState("");
  const [taskType, setTaskType] = useState("auto");
  const [compressionMode, setCompressionMode] = useState("balanced");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isWaking, setIsWaking] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const tokens = Math.ceil(prompt.trim().length / 4) || 0;
  const savesPct = result ? result.reduction_pct : null;

  useEffect(() => {
    const stored = localStorage.getItem("lakon_prompt");
    if (stored) { setPrompt(stored); localStorage.removeItem("lakon_prompt"); }
    const wake = async () => {
      const api = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const t = setTimeout(() => setIsWaking(true), 800);
      try { await fetch(`${api}/health`); } catch {}
      finally { clearTimeout(t); setIsWaking(false); }
    };
    wake();
  }, []);

  useEffect(() => {
    if (cooldown > 0) { const t = setTimeout(() => setCooldown(c => c - 1), 1000); return () => clearTimeout(t); }
  }, [cooldown]);

  const compress = useCallback(async () => {
    if (!prompt.trim()) return;
    setLoading(true); setError(null); setResult(null); setCopied(false);
    try {
      const api = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${api}/compress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, task_type: taskType, compression_mode: compressionMode }),
      });
      if (!res.ok) { let m = "Compression failed."; try { const d = await res.json(); m = d.detail || m; } catch { } throw new Error(m); }
      setResult(await res.json());
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); setCooldown(5); }
  }, [prompt, taskType, compressionMode]);

  const handleKey = (e: React.KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") compress(); };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 72px)", overflow: "hidden" }}>

      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div style={{
        height: "44px",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        borderBottom: "0.8px solid var(--border)",
        background: "var(--surface-2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ ...mono, fontSize: "10px", color: "var(--text-3)", letterSpacing: "0.1em" }}>
            PROMPT COMPRESSOR
          </span>
          {isWaking && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--amber)", display: "block", animation: "pulse-dot 1.4s infinite" }} />
              <span style={{ ...mono, fontSize: "10px", color: "var(--amber)" }}>starting server…</span>
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => { setPrompt(EXAMPLE); setResult(null); setError(null); setTimeout(() => textareaRef.current?.focus(), 50); }}
            style={{ ...mono, fontSize: "11px", color: "var(--text-3)", background: "transparent", border: "0.8px solid var(--border)", borderRadius: "var(--radius-pill)", padding: "4px 12px", cursor: "pointer", transition: "border-color 0.15s, color 0.15s", height: "26px" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.color = "var(--text-2)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-3)"; }}
          >
            try example
          </button>
          <SelectPill value={taskType} onChange={setTaskType} options={TASK_TYPES} />
          <SelectPill value={compressionMode} onChange={setCompressionMode} options={COMPRESSION_MODES} />
          {prompt && (
            <button
              onClick={() => { setPrompt(""); setResult(null); setError(null); setTimeout(() => textareaRef.current?.focus(), 50); }}
              style={{ ...mono, fontSize: "11px", color: "var(--text-3)", background: "transparent", border: "0.8px solid var(--border)", borderRadius: "var(--radius-pill)", padding: "4px 12px", cursor: "pointer", height: "26px", transition: "border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
            >
              clear
            </button>
          )}
        </div>
      </div>

      {/* ── Two-panel editor ────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 0.8px 1fr", minHeight: 0, overflow: "hidden" }}>

        {/* INPUT */}
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 20px 10px", flexShrink: 0,
          }}>
            <span style={{ ...mono, fontSize: "10px", color: "var(--text-3)", letterSpacing: "0.1em" }}>INPUT</span>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {tokens > 0 && (
                <span style={{ ...mono, fontSize: "11px", color: tokens > 6000 ? "var(--amber)" : "var(--text-3)" }}>
                  {tokens.toLocaleString()} tokens{tokens > 6000 ? " · large" : ""}
                </span>
              )}
            </div>
          </div>
          <textarea
            ref={textareaRef}
            id="app-input"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={handleKey}
            placeholder={"Paste your prompt here…\n\nTip: ⌘ + Enter to compress"}
            style={{
              ...mono,
              flex: 1,
              padding: "4px 20px 20px",
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: "13px",
              lineHeight: 1.75,
              color: "var(--text-1)",
              caretColor: "var(--green)",
              overflowY: "auto",
            }}
          />
        </div>

        {/* DIVIDER */}
        <div style={{ background: "var(--border)" }} />

        {/* OUTPUT */}
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 20px 10px", flexShrink: 0,
          }}>
            <span style={{ ...mono, fontSize: "10px", color: "var(--text-3)", letterSpacing: "0.1em" }}>OUTPUT</span>
            {result && !error && (
              <button
                onClick={() => { navigator.clipboard.writeText(result.compressed); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                style={{
                  ...mono, fontSize: "11px", background: "transparent",
                  border: `0.8px solid ${copied ? "var(--green-border)" : "var(--border)"}`,
                  borderRadius: "var(--radius-pill)", padding: "4px 12px", height: "26px",
                  color: copied ? "var(--green)" : "var(--text-2)", cursor: "pointer", transition: "all 0.15s",
                }}
              >
                {copied ? "copied ✓" : "copy"}
              </button>
            )}
          </div>

          <div style={{ flex: 1, overflow: "auto", padding: "4px 20px 20px" }}>
            {loading ? (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px" }}>
                <div style={{ width: 24, height: 24, border: "1.5px solid var(--border)", borderTopColor: "var(--green)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                <span style={{ ...mono, fontSize: "11px", color: "var(--text-3)" }}>compressing…</span>
              </div>
            ) : error ? (
              <div style={{ ...mono, fontSize: "12px", color: "rgba(239,68,68,0.75)", lineHeight: 1.7 }}>⚠ {error}</div>
            ) : result ? (
              <div>
                <div style={{ ...mono, fontSize: "13px", color: "var(--green)", lineHeight: 1.75, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  {result.compressed}
                </div>
              </div>
            ) : (
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ ...mono, fontSize: "12px", color: "var(--text-3)" }}>compressed output will appear here</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats bar ───────────────────────────────────────────────────── */}
      {result && !error && (
        <>
          <div style={{
            flexShrink: 0,
            padding: "8px 20px",
            background: "rgba(158,255,130,0.05)",
            borderTop: "0.8px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            animation: "fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" fill="var(--green)" />
              </svg>
              <span style={{ ...mono, fontSize: "11px", color: "var(--text-1)" }}>
                Want this instantly in your workflow? 
              </span>
            </div>
            <a 
              href="/lakon-extension.zip" 
              download="lakon-extension.zip"
              style={{ 
                ...mono, 
                fontSize: "11px", 
                color: "var(--green)", 
                textDecoration: "underline",
                fontWeight: 500
              }}
            >
              Install Lakon Extension →
            </a>
          </div>
          <div style={{
            flexShrink: 0,
            borderTop: "0.8px solid var(--border)",
            background: "var(--surface-2)",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            gap: "24px",
            flexWrap: "wrap",
          }}>
          <span style={{ ...mono, fontSize: "11px", color: "var(--text-2)" }}>
            {result.tokens_before} → {result.tokens_after} tokens
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "80px", height: "3px", background: "var(--border)", borderRadius: "99px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${savesPct}%`, background: "var(--green)", borderRadius: "99px", transition: "width 0.6s ease" }} />
            </div>
            <span style={{ ...mono, fontSize: "11px", color: "var(--green)", fontWeight: 600 }}>{savesPct}% saved</span>
          </div>
          {result.signal_preserved?.length > 0 && (
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {result.signal_preserved.map((s: string, i: number) => (
                <span key={i} style={{ ...mono, fontSize: "10px", color: "var(--text-2)", border: "0.8px solid var(--border)", borderRadius: "var(--radius-pill)", padding: "2px 8px" }}>{s}</span>
              ))}
            </div>
          )}
          {result.warning && <span style={{ ...mono, fontSize: "11px", color: "var(--amber)" }}>⚠ {result.warning}</span>}
        </div>
        </>
      )}

      {/* ── Compress button ─────────────────────────────────────────────── */}
      <div style={{ flexShrink: 0, padding: "14px 20px", borderTop: "0.8px solid var(--border)" }}>
        <button
          id="compress-btn"
          onClick={compress}
          disabled={loading || cooldown > 0 || !prompt.trim() || tokens > 12000}
          className="btn btn-primary"
          style={{
            width: "100%",
            height: "42px",
            borderRadius: "var(--radius-md)",
            fontSize: "13px",
            opacity: (loading || cooldown > 0 || !prompt.trim() || tokens > 12000) ? 0.35 : 1,
            cursor: (loading || cooldown > 0 || !prompt.trim()) ? "not-allowed" : "pointer",
            transition: "opacity 0.15s",
          }}
        >
          {loading ? "Compressing…" : cooldown > 0 ? `Cooldown (${cooldown}s)` : "Compress →"}
        </button>
        <div style={{ textAlign: "center", ...mono, fontSize: "10px", color: "var(--text-3)", marginTop: "8px" }}>
          ⌘ + Enter · 3 req/min · max 12,000 tokens
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse-dot { 0%,100%{opacity:1}50%{opacity:.35} } @keyframes fade-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
