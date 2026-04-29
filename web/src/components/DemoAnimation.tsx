"use client";

import React, { useState, useEffect, useRef } from "react";

const INPUT_TEXT = "Hey! I was wondering if you could help me out. I'm a backend developer and I need to understand the differences between PostgreSQL and MongoDB. I've already read the basics so you don't need to explain what databases are. I mainly want to know when I should pick one over the other for a new project. Maybe a table comparing them would be nice? Thanks so much!";

const OUTPUT_TEXT = "Backend dev. PostgreSQL vs MongoDB: when to choose each for new project. Skip fundamentals. Decision-focused. Output: table.";

const KEEP_WORDS = new Set(["backend", "developer", "PostgreSQL", "MongoDB.", "basics", "when", "pick", "new", "project.", "table"]);

type Phase = "idle" | "typing" | "waitBeforeCompress" | "compressing" | "fastTyping" | "done" | "fadeOut";

export default function DemoAnimation() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [displayedInput, setDisplayedInput] = useState("");
  const [displayedOutput, setDisplayedOutput] = useState("");
  const [inputTokens, setInputTokens] = useState(0);
  const [outputTokens, setOutputTokens] = useState(76);
  const [savedPct, setSavedPct] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef(phase);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // Intersection Observer to pause/resume
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Main animation loop
  useEffect(() => {
    if (!isVisible) return;

    let timeoutId: NodeJS.Timeout;

    const runLoop = async () => {
      if (phaseRef.current === "idle") {
        setDisplayedInput("");
        setDisplayedOutput("");
        setInputTokens(0);
        setOutputTokens(76);
        setSavedPct(0);
        setPhase("typing");
      } 
      else if (phaseRef.current === "typing") {
        let i = 0;
        const typeChar = () => {
          if (!isVisible) return; // Pause if scrolled away
          
          if (i < INPUT_TEXT.length) {
            setDisplayedInput(INPUT_TEXT.substring(0, i + 1));
            setInputTokens(Math.floor(((i + 1) / INPUT_TEXT.length) * 76));
            i++;
            timeoutId = setTimeout(typeChar, 18);
          } else {
            setPhase("waitBeforeCompress");
          }
        };
        typeChar();
      } 
      else if (phaseRef.current === "waitBeforeCompress") {
        timeoutId = setTimeout(() => {
          setPhase("compressing");
        }, 800);
      } 
      else if (phaseRef.current === "compressing") {
        // Token countdown animation during compression
        let currentTokens = 76;
        const countdown = setInterval(() => {
          if (currentTokens > 17) {
            currentTokens -= 2;
            setOutputTokens(Math.max(17, currentTokens));
          } else {
            clearInterval(countdown);
          }
        }, 40);

        timeoutId = setTimeout(() => {
          clearInterval(countdown);
          setOutputTokens(17);
          setPhase("fastTyping");
        }, 1200);
      } 
      else if (phaseRef.current === "fastTyping") {
        let i = 0;
        const typeFastChar = () => {
          if (!isVisible) return;
          
          if (i < OUTPUT_TEXT.length) {
            setDisplayedOutput(OUTPUT_TEXT.substring(0, i + 1));
            i++;
            timeoutId = setTimeout(typeFastChar, 8);
          } else {
            setPhase("done");
          }
        };
        typeFastChar();
      } 
      else if (phaseRef.current === "done") {
        // Animate the saved percentage
        let currentPct = 0;
        const pctInterval = setInterval(() => {
          if (currentPct < 78) {
            currentPct += 2;
            setSavedPct(Math.min(78, currentPct));
          } else {
            clearInterval(pctInterval);
          }
        }, 15);

        timeoutId = setTimeout(() => {
          clearInterval(pctInterval);
          setSavedPct(78);
          setPhase("fadeOut");
        }, 3000);
      } 
      else if (phaseRef.current === "fadeOut") {
        timeoutId = setTimeout(() => {
          setPhase("idle");
        }, 400); // Wait for fade out transition
      }
    };

    runLoop();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [phase, isVisible]);

  // Render input with strikethrough logic during compression
  const renderInputText = () => {
    if (phase === "compressing") {
      return INPUT_TEXT.split(' ').map((word, i) => {
        const cleanWord = word.replace(/[^\w]/g, '');
        const isKept = KEEP_WORDS.has(cleanWord) || KEEP_WORDS.has(word);
        return (
          <span key={i} className={!isKept ? "word-removing" : "text-[var(--text-3)] transition-colors duration-300"}>
            {word}{' '}
          </span>
        );
      });
    }
    
    if (phase === "fastTyping" || phase === "done") {
      return <span className="opacity-30 transition-opacity duration-500">{INPUT_TEXT}</span>;
    }

    return (
      <span>
        {displayedInput}
        {phase === "typing" && <span className="animate-pulse">|</span>}
      </span>
    );
  };

  const getStatusIndicator = () => {
    if (phase === "idle" || phase === "typing" || phase === "waitBeforeCompress") {
      return <><div className="w-1.5 h-1.5 rounded-full bg-[#888]"></div><span className="text-[#888]">reading...</span></>;
    }
    if (phase === "compressing" || phase === "fastTyping") {
      return <><div className="w-1.5 h-1.5 rounded-full bg-[var(--amber)]"></div><span className="text-[var(--amber)]">compressing...</span></>;
    }
    return <><div className="w-1.5 h-1.5 rounded-full bg-[var(--green)]"></div><span className="text-[var(--green)]">done</span></>;
  };

  return (
    <section style={{ paddingTop: '40px', paddingBottom: '0', paddingLeft: '20px', paddingRight: '20px', maxWidth: '860px', margin: '0 auto', width: '100%' }}>
      {/* Wrapper: position relative so the glow is contained */}
      <div style={{ position: 'relative' }}>
        {/* Fix 1: Atmospheric glow behind demo window */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '900px',
          height: '500px',
          background: 'radial-gradient(ellipse at center, rgba(158,255,130,0.05) 0%, rgba(158,255,130,0.02) 50%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/* WATCH IT WORK label — 12px above demo container */}
        <div
          style={{ textAlign: 'center', marginBottom: '12px', position: 'relative', zIndex: 1, fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '10px', color: 'var(--text-3)', letterSpacing: '0.1em' }}
        >
          WATCH IT WORK
        </div>

        {/* Fix 3: Demo container with green rim border and deep shadow */}
        <div
          ref={containerRef}
          style={{
            position: 'relative',
            zIndex: 1,
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(158,255,130,0.12)',
            boxShadow: '0 0 0 1px rgba(158,255,130,0.05), 0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(158,255,130,0.03)',
            background: 'var(--surface)',
            transition: 'opacity 0.4s',
            opacity: phase === 'fadeOut' ? 0 : 1,
          }}
        >
          {/* CONTAINER HEADER */}
          <div className="h-[38px] bg-[var(--surface-2)] border-b border-[var(--border)] px-4 flex items-center justify-between">
            <div className="flex items-center gap-[7px]">
              <div className="w-[10px] h-[10px] rounded-full bg-[#FF5F57]"></div>
              <div className="w-[10px] h-[10px] rounded-full bg-[#FEBC2E]"></div>
              <div className="w-[10px] h-[10px] rounded-full bg-[#28C840]"></div>
            </div>
            <div className="text-[11px] text-[var(--text-3)] font-['JetBrains_Mono']">
              lakon — live demo
            </div>
            <div className="flex items-center gap-2 text-[11px] font-['JetBrains_Mono']">
              {getStatusIndicator()}
            </div>
          </div>

          {/* CONTAINER BODY */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] min-h-[200px]">
            {/* LEFT PANEL */}
            <div className="p-5">
              <div className="flex justify-between items-center mb-4 font-['JetBrains_Mono']">
                <span className="text-[10px] text-[var(--text-3)] tracking-[0.08em] uppercase">INPUT</span>
                <span className="text-[11px] text-[var(--text-2)]">{inputTokens} tokens</span>
              </div>
              <div className="min-h-[120px] text-[13px] text-[var(--text-2)] leading-[1.7] font-['JetBrains_Mono']">
                {renderInputText()}
              </div>
            </div>

            {/* DIVIDER */}
            <div className="bg-[var(--border)] hidden md:block"></div>

            {/* RIGHT PANEL */}
            <div className="p-5">
              <div className="flex justify-between items-center mb-4 font-['JetBrains_Mono']">
                <span className="text-[10px] text-[var(--text-3)] tracking-[0.08em] uppercase">OUTPUT</span>
                {(phase === 'compressing' || phase === 'fastTyping' || phase === 'done') && (
                  <span className="text-[11px] text-[var(--green)]">{outputTokens} tokens</span>
                )}
              </div>
              <div className="min-h-[120px] text-[13px] text-[var(--green)] leading-[1.7] font-['JetBrains_Mono']">
                {displayedOutput}
                {phase === "fastTyping" && <span className="animate-pulse">|</span>}
              </div>
            </div>
          </div>

          {/* BOTTOM BAR */}
          <div className={`border-t border-[var(--border)] px-5 py-3 flex items-center gap-6 overflow-hidden transition-all duration-300 ${phase === 'done' ? 'max-h-[60px] opacity-100' : 'max-h-0 opacity-0 py-0 border-t-0'}`}>
            <div className="text-[12px] text-[var(--text-2)] font-['JetBrains_Mono']">76 → 17 tokens</div>
            <div className="text-[12px] text-[var(--green)] font-['JetBrains_Mono']">{savedPct}% saved</div>
            <div className="text-[12px] text-[var(--text-2)] font-['JetBrains_Mono']">5 signals preserved</div>
          </div>
        </div>
      </div>
    </section>
  );
}
