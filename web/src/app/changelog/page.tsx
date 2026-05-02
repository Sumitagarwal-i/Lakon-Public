"use client";

import React from "react";

const mono = { fontFamily: "var(--font-jetbrains-mono), monospace" } as const;

function UpdateEntry({ version, date, title, description, changes }: { 
  version: string; 
  date: string; 
  title: string; 
  description: string; 
  changes: string[] 
}) {
  return (
    <div style={{ marginBottom: "64px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <span style={{ 
          ...mono, 
          fontSize: "11px", 
          background: "var(--green-dim)", 
          color: "var(--green)", 
          padding: "3px 10px", 
          borderRadius: "var(--radius-pill)", 
          border: "1px solid var(--green-border)",
          fontWeight: 600
        }}>
          {version}
        </span>
        <span style={{ ...mono, fontSize: "11px", color: "var(--text-3)" }}>{date}</span>
      </div>
      
      <h2 style={{ 
        fontSize: "24px", 
        fontWeight: 600, 
        color: "var(--text-1)", 
        marginBottom: "12px",
        letterSpacing: "-0.02em" 
      }}>
        {title}
      </h2>
      
      <p style={{ 
        fontSize: "15px", 
        color: "var(--text-2)", 
        lineHeight: 1.6, 
        marginBottom: "24px",
        maxWidth: "600px" 
      }}>
        {description}
      </p>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {changes.map((change, i) => (
          <li key={i} style={{ 
            display: "flex", 
            alignItems: "flex-start", 
            gap: "12px", 
            marginBottom: "12px",
            fontSize: "14px",
            color: "var(--text-2)"
          }}>
            <span style={{ color: "var(--green)", marginTop: "4px" }}>•</span>
            <span style={{ lineHeight: 1.5 }}>{change}</span>
          </li>
        ))}
      </ul>
      
      <div style={{ width: "100%", height: "0.8px", background: "var(--border)", marginTop: "64px" }} />
    </div>
  );
}

export default function ChangelogPage() {
  return (
    <div className="animate-fade-in" style={{ padding: "60px 24px 120px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ marginBottom: "80px" }}>
          <h1 style={{ 
            fontSize: "clamp(32px, 5vw, 48px)", 
            fontWeight: 700, 
            letterSpacing: "-0.04em", 
            color: "var(--text-1)", 
            marginBottom: "16px" 
          }}>
            Changelog
          </h1>
          <p style={{ fontSize: "18px", color: "var(--text-3)", lineHeight: 1.5 }}>
            Updates and improvements to the Lakon app and extension.
          </p>
        </div>

        {/* Entries */}
        <UpdateEntry 
          version="v1.1"
          date="May 2, 2026"
          title="The Trust & Value Update"
          description="Focusing on user confidence and horizontal layout stability across all supported platforms."
          changes={[
            "New: Instant Undo support. Revert compressed prompts with one click if needed.",
            "New: Professional ephemeral toasts showing token savings in real-time.",
            "Improved: Custom tooltip system matching native platform aesthetics.",
            "Fixed: ChatGPT layout stabilization—icons now stay fixed at the bottom even with large text areas.",
            "Visual: Refined iconography and hover states for a more premium, professional feel."
          ]}
        />

        <UpdateEntry 
          version="v1.0"
          date="April 20, 2026"
          title="Initial Launch"
          description="Lakon is officially out. Stop sending raw prompts and start saving on tokens."
          changes={[
            "Support for Claude.ai, ChatGPT, and Gemini.",
            "Core compression engine optimized for 50-80% token reduction.",
            "Native browser extension for Chrome, Brave, and Edge.",
            "Zero-retention privacy architecture implemented."
          ]}
        />

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <p style={{ ...mono, fontSize: "12px", color: "var(--text-3)" }}>
            More updates coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
