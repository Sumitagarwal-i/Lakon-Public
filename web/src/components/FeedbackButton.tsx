"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Send, Loader2, CheckCircle2 } from "lucide-react";

const mono = { fontFamily: "var(--font-jetbrains-mono), monospace" } as const;

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setLoading(true);
    
    try {
      const url = "https://script.google.com/macros/s/AKfycbwjClN-q2skikoeNSkWIZm6h_WqIo6UEhFovllZawxq-f9k5Np3H_ZEPVIBD_YnpC92/exec";
      
      await fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({ message, email, task_type: "Feedback" })
      });
      
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setMessage("");
        setEmail("");
      }, 2000);
      
    } catch (error) {
      console.error("Feedback error:", error);
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div 
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(12px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
    >
      <div 
        className="card animate-fade-up"
        style={{
          width: "100%",
          maxWidth: "440px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          background: "var(--surface)",
        }}
      >
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ position: "relative", width: 18, height: 18 }}>
              <Image 
                src="/edited-photo (2).png" 
                alt="Lakon Logo" 
                fill 
                className="object-contain"
              />
            </div>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-1)" }}>Send Feedback</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            style={{ 
              background: "none",
              border: "none",
              color: "var(--text-3)",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              transition: "color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--text-1)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-3)"}
          >
            <X size={18} />
          </button>
        </div>
        
        <div style={{ padding: "24px" }}>
          {success ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 0", textAlign: "center" }}>
              <div style={{ 
                width: "48px", 
                height: "48px", 
                background: "var(--green-dim)", 
                borderRadius: "50%", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                marginBottom: "16px",
                border: "1px solid var(--green-border)"
              }}>
                <CheckCircle2 size={24} color="var(--green)" />
              </div>
              <h3 style={{ color: "var(--text-1)", fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>Sent successfully</h3>
              <p style={{ color: "var(--text-2)", fontSize: "13px" }}>We&apos;ve received your feedback. Thank you!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ ...mono, fontSize: "10px", color: "var(--text-3)", letterSpacing: "0.1em" }}>
                  MESSAGE
                </label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what we can improve…"
                  style={{
                    width: "100%",
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    fontSize: "14px",
                    color: "var(--text-1)",
                    minHeight: "120px",
                    resize: "none",
                    outline: "none",
                    transition: "border-color 0.15s",
                    caretColor: "var(--green)",
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = "var(--border-strong)"}
                  onBlur={e => e.currentTarget.style.borderColor = "var(--border)"}
                  required
                  autoFocus
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ ...mono, fontSize: "10px", color: "var(--text-3)", letterSpacing: "0.1em" }}>
                  EMAIL (OPTIONAL)
                </label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{
                    width: "100%",
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    fontSize: "14px",
                    color: "var(--text-1)",
                    outline: "none",
                    transition: "border-color 0.15s",
                    caretColor: "var(--green)",
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = "var(--border-strong)"}
                  onBlur={e => e.currentTarget.style.borderColor = "var(--border)"}
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loading || !message.trim()}
                className="btn btn-primary"
                style={{ 
                  marginTop: "8px",
                  height: "44px",
                  width: "100%",
                  opacity: (loading || !message.trim()) ? 0.5 : 1,
                }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {loading ? "Sending..." : "Send Feedback"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "13px",
          color: "var(--text-2)",
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
        Feedback
      </button>

      {isOpen && mounted && createPortal(modalContent, document.body)}
    </>
  );
}
