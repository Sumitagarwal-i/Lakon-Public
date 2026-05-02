/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

const HeroDemo = dynamic(() => import("@/components/HeroDemo"), { ssr: false });

type BrowserType = "chrome" | "brave" | "edge" | "opera" | "firefox" | "other";

function getBrowser(): BrowserType {
  if (typeof navigator === "undefined") return "chrome";
  const ua = navigator.userAgent;
  if ((navigator as any).brave) return "brave";
  if (ua.includes("Edg/")) return "edge";
  if (ua.includes("OPR/") || ua.includes("Opera")) return "opera";
  if (ua.includes("Firefox")) return "firefox";
  if (ua.includes("Chrome")) return "chrome";
  return "other";
}

const INSTALL_LABEL: Record<BrowserType, string> = {
  chrome: "Add to Chrome",
  brave: "Add to Brave",
  edge: "Add to Edge",
  opera: "Add to Opera",
  firefox: "Add to Firefox",
  other: "Download Extension",
};

const INSTALL_HREF: Record<BrowserType, string> = {
  chrome: "/lakon-extension.zip",
  brave: "/lakon-extension.zip",
  edge: "/lakon-extension.zip",
  opera: "/lakon-extension.zip",
  firefox: "https://addons.mozilla.org",
  other: "/lakon-extension.zip",
};

const mono = { fontFamily: "var(--font-jetbrains-mono), monospace" } as const;

/* ── Bolt Icon (Green) ─────────────────────────────────────────────────── */
function GreenBolt({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="var(--green)">
      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
    </svg>
  );
}

/* ── Install button ────────────────────────────────────────────────────── */
function InstallBtn({ browser, size = "md", id, scrollOnly = false }: { browser: BrowserType; size?: "sm" | "md" | "lg"; id: string; scrollOnly?: boolean }) {
  const pad = size === "lg" ? "12px 28px" : size === "sm" ? "8px 18px" : "10px 22px";
  const fs = size === "lg" ? "14px" : size === "sm" ? "12px" : "13px";
  
  const handleClick = (e: React.MouseEvent) => {
    if (scrollOnly) {
      e.preventDefault();
      const el = document.getElementById("extension");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Log download to Discord via backend
      const api = "https://lakon-api.onrender.com";
      fetch(`${api}/track/event?name=Extension%20Download&details=Browser:%20${browser}%20|%20Location:%20${id.includes("hero") ? "Hero" : "Guide"}`).catch(() => {});
    }
  };

  return (
    <a
      id={id}
      href={scrollOnly ? "#extension" : INSTALL_HREF[browser]}
      onClick={handleClick}
      download={!scrollOnly && browser !== "firefox" ? `Lakon-Extension-${browser}-v1.0.zip` : undefined}
      className="btn btn-primary"
      style={{ padding: pad, fontSize: fs, letterSpacing: "-0.01em" }}
    >
      {INSTALL_LABEL[browser]} — Free
    </a>
  );
}

/* ── Section label ─────────────────────────────────────────────────────── */
function Label({ children }: { children: string }) {
  return (
    <div style={{ ...mono, fontSize: "10px", color: "var(--text-3)", letterSpacing: "0.12em", marginBottom: "20px" }}>
      {children.toUpperCase()}
    </div>
  );
}

/* ── Platform card ─────────────────────────────────────────────────────── */
function PlatformCard({ name, color, icon, active = true }: { name: string; color: string; icon: React.ReactNode; active?: boolean }) {
  return (
    <div style={{
      background: "var(--surface)",
      border: `0.8px solid ${active ? color + "22" : "var(--border)"}`,
      borderRadius: "var(--radius-md)",
      padding: "14px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      transition: "border-color 0.2s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {icon}
        <span style={{ fontSize: "13px", fontWeight: 500, color }}>{name}</span>
      </div>
      <div style={{
        ...mono,
        fontSize: "10px",
        color: active ? "var(--green)" : "var(--text-3)",
        background: active ? "var(--green-dim)" : "var(--surface-2)",
        border: `0.8px solid ${active ? "var(--green-border)" : "var(--border)"}`,
        borderRadius: "var(--radius-pill)",
        padding: "3px 10px",
        display: "flex",
        alignItems: "center",
        gap: "5px",
      }}>
        {active && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--green)", display: "inline-block", animation: "pulse-dot 2s infinite" }} />}
        {active ? "active" : "coming soon"}
      </div>
    </div>
  );
}

/* ── Stat block ────────────────────────────────────────────────────────── */
function Stat({ value, label, green, delay }: { value: React.ReactNode; label: string; green?: boolean; delay?: string }) {
  return (
    <div className={`reveal ${delay}`} style={{ textAlign: "center", padding: "0 32px" }}>
      <div style={{
        fontSize: "clamp(36px, 5vw, 52px)",
        fontWeight: 600,
        letterSpacing: "-0.045em",
        lineHeight: 1,
        color: green ? "var(--green)" : "var(--text-1)",
        marginBottom: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>{value}</div>
      <div style={{ ...mono, fontSize: "11px", color: "var(--text-3)" }}>{label}</div>
    </div>
  );
}

/* ── Bento feature card ────────────────────────────────────────────────── */
function BentoCard({
  icon, title, body, accent, delay,
}: { icon: string; title: string; body: string; accent?: boolean; delay?: string }) {
  return (
    <div
      className={`card reveal ${delay}`}
      style={{
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        background: accent ? "linear-gradient(135deg, var(--surface) 0%, rgba(158,255,130,0.03) 100%)" : "var(--surface)",
        borderColor: accent ? "var(--green-border)" : "var(--border)",
        height: "100%",
      }}
    >
      <div style={{ fontSize: "22px", ...mono }}>{icon}</div>
      <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.02em", margin: 0, lineHeight: 1.3 }}>{title}</h3>
      <p style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: 1.7, margin: 0 }}>{body}</p>
    </div>
  );
}

/* ── Install step ──────────────────────────────────────────────────────── */
function Step({ num, title, body, delay }: { num: string; title: React.ReactNode; body: React.ReactNode; delay?: string }) {
  return (
    <div className={`reveal ${delay}`} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
      <div style={{
        ...mono,
        fontSize: "10px",
        color: "var(--green)",
        border: "0.8px solid var(--green-border)",
        borderRadius: "var(--radius-sm)",
        padding: "2px 7px",
        flexShrink: 0,
        marginTop: "3px",
        background: "var(--green-dim)",
      }}>{num}</div>
      <div>
        <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-1)", marginBottom: "3px" }}>{title}</div>
        <div style={{ fontSize: "12px", color: "var(--text-2)", lineHeight: 1.65 }}>{body}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [browser, setBrowser] = useState<BrowserType>("chrome");
  const [showAllBrowsers, setShowAllBrowsers] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBrowser(getBrowser());

    // Scroll Reveal Logic
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits the view
    });

    const reveals = document.querySelectorAll(".reveal");
    reveals.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const browsers: BrowserType[] = ["chrome", "brave", "edge", "opera", "firefox"];

  return (
    <main ref={mainRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section style={{
        width: "100%",
        maxWidth: "860px",
        margin: "0 auto",
        padding: "100px 24px 60px",
        textAlign: "center",
        position: "relative",
      }}>
        {/* Atmospheric glow */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "800px", height: "500px", pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse at 50% 30%, rgba(158,255,130,0.07) 0%, transparent 65%)",
        }} />

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Badge */}
          <div className="badge animate-fade-in" style={{ marginBottom: "32px", gap: "8px" }}>
            <div style={{ position: "relative", width: 14, height: 14 }}>
              <Image src="/edited-photo (2).png" alt="Logo" fill className="object-contain" />
            </div>
            Free browser extension
          </div>

          {/* Headline */}
          <h1 className="text-hero animate-fade-up delay-100" style={{
            color: "var(--text-1)",
            marginBottom: "20px",
            maxWidth: "700px",
            background: "linear-gradient(170deg, #ffffff 30%, rgba(255,255,255,0.65) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Most AI users send<br />their prompts raw.
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-up delay-200" style={{
            fontSize: "17px",
            color: "var(--text-2)",
            lineHeight: 1.65,
            maxWidth: "500px",
            marginBottom: "44px",
          }}>
            Lakon compresses before Claude, ChatGPT, or Gemini reads it.
            Same answer — up to 78% fewer tokens.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up delay-300" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <InstallBtn browser={browser} size="lg" id="hero-install" scrollOnly />
              
              {!showAllBrowsers ? (
                <button 
                  onClick={() => setShowAllBrowsers(true)}
                  style={{ ...mono, fontSize: "11px", color: "var(--text-3)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                >
                  Switch browser?
                </button>
              ) : (
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                  {browsers.map(b => (
                    <button 
                      key={b}
                      onClick={() => { setBrowser(b); setShowAllBrowsers(false); }}
                      style={{ 
                        ...mono, 
                        fontSize: "10px", 
                        color: browser === b ? "var(--green)" : "var(--text-3)", 
                        background: "var(--surface)", 
                        border: `1px solid ${browser === b ? "var(--green-border)" : "var(--border)"}`,
                        borderRadius: "var(--radius-sm)",
                        padding: "4px 10px",
                        cursor: "pointer"
                      }}
                    >
                      {b.charAt(0).toUpperCase() + b.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ ...mono, fontSize: "11px", color: "var(--text-3)" }}>No account · Free forever</span>
                <span style={{ color: "var(--border)" }}>·</span>
                <Link href="/app" style={{ ...mono, fontSize: "11px", color: "var(--text-3)", textDecoration: "none" }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--text-2)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--text-3)"}
                >
                  Open Playground
                </Link>
              </div>

              {/* Minimalist Trust Layer */}
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "16px", 
                opacity: 0.9,
                borderTop: "1px solid var(--border)",
                paddingTop: "14px",
                marginTop: "6px"
              }}>
                <span style={{ ...mono, fontSize: "10.5px", color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  No data is stored
                </span>
                <span style={{ color: "var(--border)", fontSize: "10.5px" }}>•</span>
                <span style={{ ...mono, fontSize: "10.5px", color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Only processes text when you click
                </span>
                <span style={{ color: "var(--border)", fontSize: "10.5px" }}>•</span>
                <span style={{ ...mono, fontSize: "10.5px", color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  No background tracking
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ DEMO ══════════════════════════════════════════════════════════ */}
      <section className="animate-fade-in delay-500" style={{ width: "100%", maxWidth: "720px", margin: "0 auto", padding: "0 24px 80px" }}>
        <HeroDemo />
        <p style={{ textAlign: "center", ...mono, fontSize: "11px", color: "var(--text-3)", marginTop: "14px" }}>
          Real example · Real compression · Runs on actual Lakon backend
        </p>
      </section>

      {/* ══ STATS ═════════════════════════════════════════════════════════ */}
      <section style={{ width: "100%", maxWidth: "860px", margin: "0 auto", padding: "0 24px 120px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Stat value="78%" label="avg tokens saved" green delay="delay-100" />
          <div className="reveal delay-200" style={{ width: "0.8px", height: "48px", background: "var(--border)", margin: "0 8px" }} />
          <Stat value="3 sec" label="average compress time" delay="delay-300" />
          <div className="reveal delay-400" style={{ width: "0.8px", height: "48px", background: "var(--border)", margin: "0 8px" }} />
          <Stat 
            delay="delay-500"
            value={
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ position: "relative", width: 22, height: 22 }}>
                  <Image src="/icons/claude.png" alt="Claude" fill className="object-contain" />
                </div>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#10A37F"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0L4.05 14.61A4.501 4.501 0 0 1 2.34 7.896zm16.597 3.855-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.768 2.75a4.5 4.5 0 0 1-.676 8.119v-5.677a.79.79 0 0 0-.385-.641zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.766-2.746a4.5 4.5 0 0 1 6.69 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5Z"/></svg>
                <div style={{ position: "relative", width: 22, height: 22 }}>
                  <Image src="/icons/gemini.png" alt="Gemini" fill className="object-contain" />
                </div>
              </div>
            } 
            label="platforms supported" 
          />
        </div>
      </section>

      {/* ══ BENTO FEATURES ════════════════════════════════════════════════ */}
      <section style={{ width: "100%", maxWidth: "860px", margin: "0 auto", padding: "0 24px 120px", borderTop: "0.8px solid var(--border)", paddingTop: "80px" }}>
        <div className="reveal">
          <Label>How it works</Label>
          <h2 className="text-h2" style={{ color: "var(--text-1)", marginBottom: "12px", maxWidth: "480px" }}>
            Not just shorter.<br />Smarter.
          </h2>
          <p style={{ fontSize: "15px", color: "var(--text-2)", lineHeight: 1.65, maxWidth: "460px", marginBottom: "48px" }}>
            Lakon uses LLM attention mechanics to restructure where signal lands — not just remove words.
          </p>
        </div>

        {/* Bento grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "auto auto", gap: "12px" }}>
          <div style={{ gridColumn: "1 / 3" }}>
            <BentoCard
              icon="◎"
              accent
              title="No filler. All signal."
              body="Polite phrasing, hedging, redundant scaffolding — removed. The AI receives a clean, dense instruction with no noise to process."
              delay="delay-100"
            />
          </div>
          <BentoCard
            icon="→"
            title="3 seconds inline."
            body="Extension compresses directly inside the input box. You never leave the page."
            delay="delay-200"
          />
          <BentoCard
            icon="⬡"
            title="Constraints survive. Always."
            body="Frameworks, formats, word counts — every specification passes through intact."
            delay="delay-300"
          />
          <div style={{ gridColumn: "2 / 4" }}>
            <BentoCard
              icon="◈"
              title="Attention-zone restructuring."
              body="LLMs pay most attention to prompt beginnings and ends. Lakon moves your critical instructions into those zones automatically."
              delay="delay-400"
            />
          </div>
        </div>

        {/* Callout */}
        <div className="reveal delay-500" style={{
          marginTop: "24px",
          background: "var(--surface)",
          border: "0.8px solid var(--border)",
          borderLeft: "2px solid var(--green)",
          borderRadius: "var(--radius-md)",
          padding: "18px 22px",
        }}>
          <p style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: 1.75, margin: 0 }}>
            <strong style={{ color: "var(--text-1)", fontWeight: 500 }}>This is not find-and-replace.</strong>{" "}
            Lakon applies the same attention research that LLM labs use internally — primacy and recency effects — to restructure your prompt so the model reads it more efficiently.
          </p>
        </div>
      </section>

      {/* ══ EXTENSION INSTALL ═════════════════════════════════════════════ */}
      <section
        id="extension"
        style={{ width: "100%", maxWidth: "860px", margin: "0 auto", padding: "80px 24px 120px", borderTop: "0.8px solid var(--border)" }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "72px", alignItems: "start" }}>

          {/* Left */}
          <div className="reveal">
            <Label>Get the extension</Label>
            <h2 className="text-h2" style={{ color: "var(--text-1)", marginBottom: "14px" }}>
              Compress inside<br />your AI tool.
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.7, marginBottom: "40px" }}>
              Install once. The extension injects a button into Claude, ChatGPT, and Gemini. No copy-paste, no tab switching.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "22px", marginBottom: "40px" }}>
              <Step num="01" title="Install the extension" body="Click the button, load unpacked in your browser's extension page." delay="delay-100" />
              <Step num="02" title="Open your AI tool" body="Navigate to Claude, ChatGPT, or Gemini as you normally would." delay="delay-200" />
              <Step 
                num="03" 
                delay="delay-300"
                title={
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    Click <GreenBolt size={14} /> and send
                  </span>
                }
                body={
                  <span style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap" }}>
                    The Lakon button <GreenBolt /> appears next to Send. One click compresses in place.
                  </span>
                } 
              />
            </div>
            <div className="reveal delay-400" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <InstallBtn browser={browser} size="md" id="ext-section-install" />
              <div style={{ ...mono, fontSize: "11px", color: "var(--text-3)", paddingLeft: "2px" }}>Chrome · Brave · Opera · Edge · Firefox</div>
            </div>
          </div>

          {/* Right: platform status cards */}
          <div className="reveal delay-300" style={{ display: "flex", flexDirection: "column", gap: "10px", paddingTop: "8px" }}>
            <PlatformCard
              name="ChatGPT"
              color="#10A37F"
              icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="#10A37F"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0L4.05 14.61A4.501 4.501 0 0 1 2.34 7.896zm16.597 3.855-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.768 2.75a4.5 4.5 0 0 1-.676 8.119v-5.677a.79.79 0 0 0-.385-.641zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.766-2.746a4.5 4.5 0 0 1 6.69 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5Z"/></svg>}
            />
            <PlatformCard
              name="Claude"
              color="#D97757"
              icon={<div style={{ position: "relative", width: 15, height: 15 }}>
                <Image src="/icons/claude.png" alt="Claude" fill className="object-contain" />
              </div>}
            />
            <PlatformCard
              name="Gemini"
              color="#4E82EE"
              icon={<div style={{ position: "relative", width: 15, height: 15 }}>
                <Image src="/icons/gemini.png" alt="Gemini" fill className="object-contain" />
              </div>}
            />
            <PlatformCard name="Copilot" color="#50A0E0" active={false}
              icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="#50A0E0" opacity="0.4"><path d="M11.4 0H0v11.4h11.4V0zM24 0H12.6v11.4H24V0zM11.4 12.6H0V24h11.4V12.6zM24 12.6H12.6V24H24V12.6z"/></svg>}
            />
          </div>
        </div>
      </section>

      {/* ══ BOTTOM CTA ════════════════════════════════════════════════════ */}
      <section style={{
        width: "100%",
        maxWidth: "860px",
        margin: "0 auto",
        padding: "100px 24px 120px",
        textAlign: "center",
        borderTop: "0.8px solid var(--border)",
      }}>
        <p className="reveal" style={{ ...mono, fontSize: "11px", color: "var(--text-3)", letterSpacing: "0.1em", marginBottom: "20px" }}>
          START COMPRESSING
        </p>
        <h2 className="text-h2 reveal delay-100" style={{
          color: "var(--text-1)",
          marginBottom: "16px",
          background: "linear-gradient(170deg, #ffffff 30%, rgba(255,255,255,0.6) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          You&apos;ve been sending<br />your prompts raw.
        </h2>
        <p className="reveal delay-200" style={{ fontSize: "15px", color: "var(--text-2)", marginBottom: "40px" }}>Stop.</p>
        <div className="reveal delay-300" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <InstallBtn browser={browser} size="lg" id="bottom-install" />
          <Link href="/app" style={{ ...mono, fontSize: "11px", color: "var(--text-3)", textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--text-2)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-3)"}
          >
            Use web app instead →
          </Link>
        </div>
      </section>

    </main>
  );
}
