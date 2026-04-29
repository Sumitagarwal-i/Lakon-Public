/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const mono = { fontFamily: "var(--font-jetbrains-mono), monospace" } as const;

/* ── Bolt Icon (Green) ─────────────────────────────────────────────────── */
function GreenBolt({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="var(--green)" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
    </svg>
  );
}

// ─── Docs sections ───────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  { id: "what-is-lakon", label: "What is Lakon?" },
  { id: "quick-start", label: "Quick Start" },
  { id: "how-it-works", label: "How It Works" },
  { id: "extension-guide", label: "Extension Guide" },
  { id: "web-app", label: "Web App" },
  { id: "api", label: "API Reference" },
  { id: "faq", label: "FAQ" },
];

// ─── Mini compressor widget for Try It section ────────────────────────────
function TryItWidget() {
  const [input, setInput] = useState("Hey! I was wondering if you could help me out. I'm a backend developer and I need to understand the differences between PostgreSQL and MongoDB.");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const api = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${api}/compress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, task_type: "auto", compression_mode: "balanced" }),
      });
      if (!res.ok) throw new Error("Compression failed");
      setResult(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reveal" style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", marginTop: "20px" }}>
      <div style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)", padding: "10px 16px", display: "flex", gap: "6px" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF5F57" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FEBC2E" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28C840" }} />
        <span style={{ ...mono, fontSize: "10px", color: "var(--text-3)", marginLeft: 8 }}>try it here</span>
      </div>
      <div style={{ padding: "16px" }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{
            ...mono,
            width: "100%",
            minHeight: "80px",
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "10px",
            fontSize: "13px",
            color: "var(--text-1)",
            resize: "vertical",
            outline: "none",
            caretColor: "var(--green)",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
          <span style={{ ...mono, fontSize: "11px", color: "var(--text-3)" }}>
            {Math.ceil(input.trim().length / 4)} tokens
          </span>
          <button
            onClick={run}
            disabled={loading || !input.trim()}
            style={{
              background: "var(--green)",
              color: "#000",
              border: "none",
              borderRadius: "6px",
              padding: "7px 18px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: loading ? "wait" : "pointer",
              opacity: !input.trim() ? 0.4 : 1,
            }}
          >
            {loading ? "Compressing..." : "Compress →"}
          </button>
        </div>
        {result && (
          <div style={{ marginTop: "14px", borderTop: "1px solid var(--border)", paddingTop: "14px" }}>
            <div style={{ ...mono, fontSize: "13px", color: "var(--green)", lineHeight: 1.6, whiteSpace: "pre-wrap", marginBottom: "10px" }}>
              {result.compressed}
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <span style={{ ...mono, fontSize: "11px", color: "var(--text-2)" }}>{result.tokens_before} → {result.tokens_after} tokens</span>
              <span style={{ ...mono, fontSize: "11px", color: "var(--green)" }}>{result.reduction_pct}% saved</span>
            </div>
          </div>
        )}
        {error && <div style={{ ...mono, fontSize: "12px", color: "rgba(239,68,68,0.8)", marginTop: "10px" }}>⚠ {error}</div>}
      </div>
    </div>
  );
}

// ─── Code block ─────────────────────────────────────────────────────────────
function Code({ children, delay }: { children: string; delay?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className={`reveal ${delay}`} style={{ position: "relative", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px", marginTop: "12px", marginBottom: "12px" }}>
      <button
        onClick={() => { navigator.clipboard.writeText(children); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        style={{ position: "absolute", top: "10px", right: "10px", ...mono, fontSize: "10px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "4px", padding: "3px 8px", color: copied ? "var(--green)" : "var(--text-3)", cursor: "pointer" }}
      >
        {copied ? "copied!" : "copy"}
      </button>
      <pre style={{ ...mono, fontSize: "12px", color: "var(--text-2)", lineHeight: 1.7, margin: 0, overflowX: "auto", whiteSpace: "pre-wrap" }}>{children}</pre>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────
function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ paddingBottom: "64px", borderBottom: "1px solid var(--border)", marginBottom: "64px" }}>
      <h2 className="reveal" style={{ fontSize: "22px", fontWeight: 600, letterSpacing: "-0.03em", color: "var(--text-1)", marginBottom: "20px" }}>{title}</h2>
      {children}
    </section>
  );
}

function P({ children, delay }: { children: React.ReactNode; delay?: string }) {
  return <p className={`reveal ${delay}`} style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.8, marginBottom: "16px" }}>{children}</p>;
}

function H3({ children, delay }: { children: React.ReactNode; delay?: string }) {
  return <h3 className={`reveal ${delay}`} style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-1)", marginTop: "28px", marginBottom: "10px" }}>{children}</h3>;
}

export default function DocsPage() {
  const [active, setActive] = useState("what-is-lakon");

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, { threshold: 0.1 });

    const reveals = document.querySelectorAll(".reveal");
    reveals.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  };

  return (
    <div style={{ display: "flex", width: "100%", maxWidth: "1100px", margin: "0 auto", padding: "0 24px", minHeight: "calc(100vh - 52px)" }}>

      {/* Sidebar */}
      <aside style={{
        width: "220px",
        flexShrink: 0,
        paddingTop: "48px",
        paddingRight: "40px",
        position: "sticky",
        top: "52px",
        height: "fit-content",
        alignSelf: "flex-start",
      }}>
        <div style={{ ...mono, fontSize: "10px", color: "var(--text-3)", letterSpacing: "0.12em", marginBottom: "16px" }}>DOCUMENTATION</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {NAV_SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              style={{
                background: active === s.id ? "var(--surface)" : "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                padding: "6px 10px",
                borderRadius: "6px",
                fontSize: "13px",
                color: active === s.id ? "var(--text-1)" : "var(--text-2)",
                fontWeight: active === s.id ? 500 : 400,
                transition: "all 0.15s",
              } as any}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid var(--border)" }}>
          <Link href="/app" style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12px",
            color: "var(--green)",
            textDecoration: "none",
            fontWeight: 500,
          }}>
            <div style={{ position: "relative", width: 14, height: 14 }}>
              <Image src="/edited-photo (2).png" alt="Logo" fill className="object-contain" />
            </div>
            Open Web App
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, paddingTop: "48px", paddingBottom: "80px", minWidth: 0 }}>

        <Section id="what-is-lakon" title="What is Lakon?">
          <P>
            Lakon is a <strong style={{ color: "var(--text-1)" }}>semantic prompt compressor</strong>. It takes the prompts you write for Claude, ChatGPT, or Gemini and removes everything that wastes tokens — polite phrasing, redundant context, scaffolding — while preserving every piece of signal the AI needs to answer correctly.
          </P>
          <P delay="delay-100">
            It is not a prompt improver. It is not a rewriter. It is a compression engine. The output is always shorter. The AI&apos;s response is always equivalent.
          </P>
          <div className="reveal delay-200" style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderLeft: "2px solid var(--green)",
            borderRadius: "8px",
            padding: "16px 20px",
            ...mono,
            fontSize: "13px",
            color: "var(--text-2)",
            lineHeight: 1.7,
            marginTop: "20px",
          }}>
            <strong style={{ color: "var(--text-1)" }}>The core claim:</strong> 78% fewer tokens on average. Same quality answer from the AI.
          </div>
        </Section>

        <Section id="quick-start" title="Quick Start">
          <H3>Option 1 — Browser Extension (Recommended)</H3>
          <P>Install the extension and compress directly inside Claude, ChatGPT, or Gemini. No copy-paste. No tab switching.</P>
          <div className="reveal delay-100" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
            {["Chrome", "Brave", "Opera", "Edge"].map(b => (
              <a
                key={b}
                href="/lakon-extension-chrome.zip"
                download={`Lakon-Extension-${b.toLowerCase()}-v1.0.zip`}
                style={{
                  ...mono,
                  fontSize: "12px",
                  color: "var(--text-1)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  padding: "6px 14px",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  background: "var(--surface)",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--green-border)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                ↓ {b}
              </a>
            ))}
          </div>

          <H3>Option 2 — Web App</H3>
          <P>No installation needed. Paste your prompt at <Link href="/app" style={{ color: "var(--green)" }}>/app</Link> and compress directly.</P>

          <H3>Try It Now</H3>
          <P>Test compression live without installing anything:</P>
          <TryItWidget />
        </Section>

        <Section id="how-it-works" title="How It Works">
          <P>
            Lakon sends your prompt to a compression backend powered by Groq. A specialized system prompt instructs the model to:
          </P>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
            {[
              ["Remove filler", "Polite phrasing, hedging words, redundant restatements of the request."],
              ["Restructure for attention", "LLMs pay most attention to the beginning and end of a prompt (primacy/recency effect). Lakon moves signal to those zones."],
              ["Preserve every constraint", "Frameworks, formats, word counts, tone instructions — all survive compression exactly as specified."],
              ["Output only valid JSON", "The backend returns compressed text, token counts, and preserved signals — never commentary."],
            ].map(([title, desc], idx) => (
              <div key={title as string} className="reveal" style={{ display: "flex", gap: "16px", transitionDelay: `${idx * 100}ms` }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--green)", marginTop: "8px", flexShrink: 0 }} />
                <div>
                  <strong style={{ fontSize: "13px", color: "var(--text-1)" }}>{title}</strong>
                  <p style={{ fontSize: "13px", color: "var(--text-2)", margin: "3px 0 0", lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <H3>What it returns</H3>
          <Code delay="delay-100">{`{
  "compressed": "Compare PostgreSQL vs MongoDB: when to use each. Skip basics. Include decision table.",
  "tokens_before": 76,
  "tokens_after": 17,
  "reduction_pct": 78,
  "signal_preserved": ["technical comparison", "decision table format"],
  "warning": null
}`}</Code>
        </Section>

        <Section id="extension-guide" title="Extension Guide">
          <H3>Installing in Developer Mode (Chrome / Brave / Opera / Edge)</H3>
          <P>Until the extension is live on the Chrome Web Store, install it manually:</P>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              ["1", "Download the extension ZIP", "Click the download link above. Save and extract the ZIP file."],
              ["2", "Open Extensions", "Navigate to chrome://extensions/ in your browser."],
              ["3", "Enable Developer Mode", "Toggle the switch in the top-right corner of the extensions page."],
              ["4", "Load Unpacked", "Click \"Load unpacked\" and select the extracted extension folder."],
              ["5", "Pin Lakon", "Click the puzzle icon in your toolbar → find Lakon → click the pin icon."],
            ].map(([num, title, desc], idx) => (
              <div key={num as string} className="reveal" style={{ display: "flex", gap: "14px", alignItems: "flex-start", transitionDelay: `${idx * 100}ms` }}>
                <div style={{
                  ...mono,
                  fontSize: "10px",
                  color: "var(--green)",
                  border: "1px solid var(--green-border)",
                  borderRadius: "4px",
                  padding: "2px 7px",
                  flexShrink: 0,
                  marginTop: "2px",
                }}>{num}</div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-1)", marginBottom: "2px" }}>{title}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-2)", lineHeight: 1.6 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          <H3>Using the Extension</H3>
          <P>After installation, open Claude, ChatGPT, or Gemini. Type your prompt as usual. You&apos;ll see a <strong style={{ color: "var(--text-1)", display: "inline-flex", alignItems: "center", gap: "4px" }}><GreenBolt size={14} /> Lakon</strong> button appear next to the send button. Click it — your prompt is replaced with the compressed version instantly.</P>

          <H3>Supported Platforms</H3>
          <div className="reveal delay-100" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {["claude.ai", "chatgpt.com", "gemini.google.com"].map(p => (
              <span key={p} style={{ ...mono, fontSize: "11px", color: "var(--text-2)", border: "1px solid var(--border)", borderRadius: "4px", padding: "4px 10px" }}>{p}</span>
            ))}
          </div>
        </Section>

        <Section id="web-app" title="Web App">
          <P>The web app at <Link href="/app" style={{ color: "var(--green)" }}>lakonai.vercel.app/app</Link> lets you compress prompts without installing the extension. It&apos;s identical to the extension&apos;s backend — same compression quality.</P>

          <H3>When to use the web app</H3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              "You're on a computer where you can't install extensions",
              "You want to compress a very long prompt before pasting it into an AI tool",
              "You want to test how Lakon works before installing",
            ].map((s, idx) => (
              <div key={s} className="reveal" style={{ display: "flex", gap: "10px", alignItems: "flex-start", transitionDelay: `${idx * 100}ms` }}>
                <span style={{ color: "var(--green)", marginTop: "1px" }}>→</span>
                <span style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: 1.6 }}>{s}</span>
              </div>
            ))}
          </div>

          <H3>Keyboard Shortcut</H3>
          <P>Press <code style={{ ...mono, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "4px", padding: "2px 6px", fontSize: "12px" }}>⌘ + Enter</code> (Mac) or <code style={{ ...mono, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "4px", padding: "2px 6px", fontSize: "12px" }}>Ctrl + Enter</code> (Windows) to compress.</P>
        </Section>

        <Section id="api" title="API Reference">
          <P>The Lakon backend exposes a simple REST API. You can call it directly from your own code.</P>

          <H3>Base URL</H3>
          <Code>{process.env.NEXT_PUBLIC_API_URL || "https://your-lakon-api.onrender.com"}</Code>

          <H3>POST /compress</H3>
          <P>Compresses a prompt. Returns the compressed text and token statistics.</P>

          <strong className="reveal" style={{ fontSize: "13px", color: "var(--text-1)" }}>Request body</strong>
          <Code delay="delay-100">{`{
  "prompt": "string (required)",
  "task_type": "auto | coding | writing | analysis | creative | data",
  "compression_mode": "strict | balanced | creative"
}`}</Code>

          <strong className="reveal" style={{ fontSize: "13px", color: "var(--text-1)" }}>Response</strong>
          <Code delay="delay-100">{`{
  "compressed": "string",
  "tokens_before": number,
  "tokens_after": number,
  "reduction_pct": number,
  "signal_preserved": string[],
  "warning": string | null
}`}</Code>

          <strong className="reveal" style={{ fontSize: "13px", color: "var(--text-1)" }}>Example (curl)</strong>
          <Code delay="delay-100">{`curl -X POST https://your-api.onrender.com/compress \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "Help me understand React hooks.", "task_type": "auto"}'`}</Code>

          <H3>GET /health</H3>
          <P>Returns server status. Use this to wake the server on cold start.</P>
          <Code delay="delay-100">{`curl https://your-api.onrender.com/health
# → {"status": "ok", "message": "Server is awake"}`}</Code>

          <H3>Rate Limits</H3>
          <P>3 requests per minute per IP address. Designed for interactive use, not batch processing.</P>
        </Section>

        <Section id="faq" title="FAQ">
          {[
            {
              q: "Is this just removing words?",
              a: "No. Lakon uses a compression model that understands LLM attention mechanics. It restructures prompts — moving signal to high-attention zones — rather than just deleting words. Every technical constraint you specify survives.",
            },
            {
              q: "Will the AI give me a worse answer?",
              a: "No. In most cases the answer is identical. In some cases it&apos;s better, because the AI receives a cleaner signal with less noise to process. The compression is specifically designed to preserve intent.",
            },
            {
              q: "Does Lakon store my prompts?",
              a: "No. Your prompt is sent to the compression backend, processed, and the result is returned. Nothing is stored or logged beyond what Render.com keeps in server logs (IP address, timestamp).",
            },
            {
              q: "Why is the first request slow?",
              a: "The backend runs on Render&apos;s free tier, which spins down after inactivity. The first request after a period of no activity takes 20–30 seconds to wake the server. Subsequent requests are fast.",
            },
            {
              q: "Can I use this for very long prompts?",
              a: "Yes, up to 12,000 tokens (roughly 9,000 words). Above that, the web app will warn you. The extension has no hard limit.",
            },
            {
              q: "Why build this as an extension?",
              a: "Because that&apos;s where the friction is. The moment you need to compress a prompt, you&apos;re already inside Claude or ChatGPT. Leaving the tab to paste into a web app creates enough friction that people stop using the tool. The extension removes that friction entirely.",
            },
          ].map(({ q, a }, idx) => (
            <div key={q} className="reveal" style={{ marginBottom: "28px", transitionDelay: `${idx * 50}ms` }}>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-1)", marginBottom: "8px" }}>{q}</div>
              <div style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: 1.7 }}>{a}</div>
            </div>
          ))}
        </Section>

      </main>
    </div>
  );
}
