"use client";

import Link from "next/link";
import Image from "next/image";
import FeedbackButton from "./FeedbackButton";

export default function Navbar() {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", justifyContent: "center", padding: "14px 20px" }}>
      <nav
        className="animate-slide-down delay-200"
        style={{
          width: "100%",
          maxWidth: "900px",
          height: "44px",
          background: "rgba(17, 17, 19, 0.82)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "0.8px solid rgba(255,255,255,0.09)",
          borderRadius: "9999px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 8px 0 14px",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
            color: "var(--text-1)",
          }}
        >
          <div style={{ position: "relative", width: 22, height: 22 }}>
            <Image 
              src="/edited-photo (2).png" 
              alt="Lakon Logo" 
              fill 
              className="object-contain"
            />
          </div>
          <span
            style={{
              fontSize: "15px",
              fontWeight: 650,
              letterSpacing: "-0.04em",
              color: "var(--text-1)",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            Lakon
          </span>
        </Link>

        {/* Center: subtle nav links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {[
            { href: "/docs", label: "Docs" },
            { href: "/app", label: "Web App" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontSize: "13px",
                color: "var(--text-2)",
                textDecoration: "none",
                padding: "5px 12px",
                borderRadius: "9999px",
                transition: "color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text-1)";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-2)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              {l.label}
            </Link>
          ))}
          <FeedbackButton />
        </div>

        {/* Right: CTA */}
        <a
          href="/#extension"
          className="btn btn-primary"
          style={{ height: "32px", fontSize: "12px", padding: "0 16px", borderRadius: "9999px" }}
        >
          Get Extension
        </a>
      </nav>
    </div>
  );
}
