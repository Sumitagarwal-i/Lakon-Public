const API_BASE = "https://lakon-api.onrender.com";

// --- STYLING ---
const style = document.createElement('style');
style.textContent = `
  @keyframes lakon-fade-up {
    0% { opacity: 0; transform: translateY(10px); }
    15% { opacity: 1; transform: translateY(0); }
    85% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-10px); }
  }
  .lakon-toast {
    position: absolute;
    background: #000;
    color: #fff;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 11px;
    font-family: sans-serif;
    pointer-events: none;
    z-index: 10000;
    white-space: nowrap;
    animation: lakon-fade-up 2s ease forwards;
  }
  .lakon-undo-btn {
    background: transparent !important;
    border: none !important;
    color: #ccc; 
    padding: 0;
    cursor: pointer;
    margin-right: 4px;
    transition: background 0.2s;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: 50%;
  }
  .lakon-undo-btn:hover {
    background: rgba(255,255,255,0.08) !important;
  }
  .lakon-shrink-btn {
    background: transparent !important;
  }
  .lakon-tooltip {
    position: absolute;
    background: #000;
    color: #fff;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    pointer-events: none;
    z-index: 10001;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.15s;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    border: 0.5px solid rgba(255,255,255,0.1);
  }
`;
document.head.appendChild(style);

let lastOriginalText = null;
let activeUndoBtn = null;
let undoTimeout = null;

function cleanupUndo() {
  if (activeUndoBtn) {
    activeUndoBtn.remove();
    activeUndoBtn = null;
  }
  lastOriginalText = null;
  if (undoTimeout) clearTimeout(undoTimeout);
}

const CONFIG = [
  {
    host: "claude.ai",
    inputSelector: 'div[contenteditable="true"].ProseMirror',
    injectFn: () => {}, // Handled directly in MutationObserver for Claude
    claudeSendSelector: 'button[aria-label="Send Message"], button[aria-label="Send message"]',
    get: (el) => el.innerText,
    set: (el, text) => {
      el.innerHTML = text; 
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  },
  {
    host: ["chatgpt.com", "chat.openai.com"],
    inputSelector: 'div[contenteditable="true"]#prompt-textarea',
    injectFn: (input, btn) => {
      const sendBtn = document.querySelector('button[data-testid="send-button"]');
      if (!sendBtn) return;
      
      const actionBar = sendBtn.parentElement;
      const mainWrapper = actionBar?.parentElement;
      
      if (mainWrapper && !mainWrapper.querySelector('.lakon-shrink-btn')) {
        // Use a dedicated wrapper to isolate from ChatGPT's button CSS
        // By relying on the parent's native flex alignment, we ensure perfect vertical centering.
        const lakonWrapper = document.createElement('div');
        lakonWrapper.className = 'lakon-wrapper';
        lakonWrapper.style.cssText = 'display: flex; align-items: center; justify-content: center; margin-right: 4px; z-index: 100;';
        lakonWrapper.appendChild(btn);
        
        mainWrapper.insertBefore(lakonWrapper, actionBar);
      }
    },
    get: (el) => el.innerText,
    set: (el, text) => {
      el.innerHTML = `<p>${text}</p>`;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  },
  {
    host: "gemini.google.com",
    inputSelector: 'div[contenteditable="true"].ql-editor',
    injectFn: (input, btn) => {
      const sendBtn = document.querySelector('button.send-button, button[aria-label="Send message"], button[data-testid="send-button"]');
      if (!sendBtn) return;
      const sendWrapper = sendBtn.parentElement;
      const toolbar = sendWrapper?.parentElement;
      if (!toolbar || toolbar.querySelector('.lakon-shrink-btn')) return;
      btn.style.position = 'relative';
      btn.style.margin = '0 8px';
      btn.style.background = 'transparent';
      btn.style.zIndex = '100';
      const modelPickerWrapper = sendWrapper.previousElementSibling;
      try {
        if (modelPickerWrapper) {
          toolbar.insertBefore(btn, modelPickerWrapper);
        } else {
          toolbar.insertBefore(btn, sendWrapper);
        }
      } catch (e) {
        toolbar.appendChild(btn);
      }
    },
    get: (el) => el.innerText,
    set: (el, text) => {
      el.innerHTML = `<p>${text}</p>`;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  },
  {
    host: "github.com",
    inputSelector: 'textarea#copilot-chat-textarea',
    injectFn: (input, btn) => {
      const container = input.closest('form') || input.parentElement;
      if (container && !container.querySelector('.lakon-shrink-btn')) {
        container.appendChild(btn);
      }
    },
    get: (el) => el.value,
    set: (el, text) => {
      el.value = text;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
];

function showToast(anchor, text) {
  const toast = document.createElement('div');
  toast.className = 'lakon-toast';
  toast.textContent = text;
  
  // Position it relative to the button
  const rect = anchor.getBoundingClientRect();
  toast.style.left = `${rect.left + (rect.width/2)}px`;
  toast.style.top = `${rect.top - 30 + window.scrollY}px`;
  toast.style.transform = 'translateX(-50%)';
  
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2100);
}

let activeTooltip = null;

function showTooltip(anchor, text) {
  hideTooltip();
  const tip = document.createElement('div');
  tip.className = 'lakon-tooltip';
  tip.textContent = text;
  document.body.appendChild(tip);
  
  const rect = anchor.getBoundingClientRect();
  tip.style.left = `${rect.left + (rect.width/2) - (tip.offsetWidth/2)}px`;
  tip.style.top = `${rect.bottom + 8 + window.scrollY}px`; // Below icon
  
  requestAnimationFrame(() => {
    tip.style.opacity = '1';
  });
  activeTooltip = tip;
}

function hideTooltip() {
  if (activeTooltip) {
    activeTooltip.remove();
    activeTooltip = null;
  }
}

function showUndo(container, input, platform) {
  cleanupUndo();
  
  const undoBtn = document.createElement('button');
  undoBtn.className = 'lakon-undo-btn';
  undoBtn.style.color = '#ccc'; // More like little white
  
  undoBtn.onmouseenter = () => showTooltip(undoBtn, "Undo");
  undoBtn.onmouseleave = hideTooltip;

  undoBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 10h10a5 5 0 0 1 5 5v0a5 5 0 0 1-5 5h-2"></path>
      <path d="M3 10l5-5"></path>
      <path d="M3 10l5 5"></path>
    </svg>
  `;
  
  undoBtn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    hideTooltip();
    if (lastOriginalText) {
      platform.set(input, lastOriginalText);
      cleanupUndo();
    }
  };
  
  const lakonBtn = container.querySelector('.lakon-shrink-btn');
  if (lakonBtn) {
    lakonBtn.insertAdjacentElement('beforebegin', undoBtn);
    activeUndoBtn = undoBtn;
  }
}

function createButton(input, platform) {
  const shrinkBtn = document.createElement("button");
  shrinkBtn.className = "lakon-shrink-btn";
  shrinkBtn.type = "button";
  
  shrinkBtn.onmouseenter = () => {
    if (!shrinkBtn.disabled) {
      showTooltip(shrinkBtn, "Compress");
      shrinkBtn.style.opacity = '1';
      shrinkBtn.style.background = 'rgba(158,255,130,0.08)';
    }
  };
  shrinkBtn.onmouseleave = () => {
    hideTooltip();
    if (!shrinkBtn.disabled) {
      shrinkBtn.style.opacity = '0.7';
      shrinkBtn.style.background = 'transparent';
    }
  };

  shrinkBtn.innerHTML = `
<svg width="18" height="18" viewBox="0 0 24 24" 
     fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" 
        fill="#9EFF82" stroke="#9EFF82" 
        stroke-width="1.5" stroke-linejoin="round"/>
</svg>`;

  const isClaude = window.location.hostname.includes('claude.ai');
  const isGemini = window.location.hostname.includes('gemini.google.com');

  shrinkBtn.style.cssText = `
    background: transparent;
    border: none;
    cursor: pointer;
    padding: ${isClaude ? '4px 6px' : isGemini ? '4px' : '6px'};
    margin: ${isGemini ? '0 10px' : '0 6px'};
    opacity: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${isClaude ? '6px' : '50%'};
    width: ${isClaude ? 'auto' : isGemini ? '36px' : '32px'};
    height: ${isClaude ? 'auto' : isGemini ? '36px' : '32px'};
    transition: opacity 0.3s ease, background 0.15s, filter 0.15s;
    z-index: 9999;
    flex-shrink: 0;
  `;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      shrinkBtn.style.opacity = '0.7';
    });
  });

  shrinkBtn.onclick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const text = platform.get(input);
    if (!text || !text.trim()) return;

    shrinkBtn.style.opacity = '0.3';
    shrinkBtn.disabled = true;
    hideTooltip();
    showTooltip(shrinkBtn, "Compressing...");

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`${API_BASE}/compress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: text, 
          task_type: "auto",
          platform: window.location.hostname
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      if (!res.ok) throw new Error("API Error");

      const data = await res.json();
      
      // Save for Undo
      lastOriginalText = text;
      
      platform.set(input, data.compressed);

      chrome.storage.local.set({
        lastTokensBefore: data.tokens_before,
        lastTokensAfter: data.tokens_after,
        lastReductionPct: data.reduction_pct,
        lastCompressedAt: Date.now()
      });

      // Show Toast & Undo
      showToast(shrinkBtn, `-${data.tokens_before - data.tokens_after} tokens`);
      showUndo(shrinkBtn.parentElement, input, platform);

      // Success state (clean & simple)
      shrinkBtn.style.opacity = '1';
      
      setTimeout(() => {
        shrinkBtn.disabled = false;
        shrinkBtn.style.filter = 'none';
        shrinkBtn.style.opacity = '0.7';
        shrinkBtn.style.background = 'transparent';
      }, 2000);

    } catch (err) {
      shrinkBtn.title = "Shrink with Lakon";
      shrinkBtn.disabled = false;
      shrinkBtn.style.opacity = '0.7';
    }
  };

  return shrinkBtn;
}

const currentHost = window.location.hostname;
const platform = CONFIG.find(c => 
  Array.isArray(c.host) ? c.host.some(h => currentHost.includes(h)) : currentHost.includes(c.host)
);

if (platform) {
  let debounceTimer;
  const isClaude = currentHost.includes('claude.ai');
  const delay = (isClaude || currentHost.includes('gemini.google.com')) ? 800 : 500;

  const sync = () => {
    const input = document.querySelector(platform.inputSelector);
    const existingBtn = document.querySelector('.lakon-shrink-btn');

    if (input && !input.dataset.lakonListener) {
      input.addEventListener('input', () => {
        // If user types, remove undo
        if (lastOriginalText) cleanupUndo();
      });
      input.dataset.lakonListener = "true";
    }

    if (isClaude) {
      const sendBtn = document.querySelector(platform.claudeSendSelector);
      if (input && sendBtn && !existingBtn) {
        const btn = createButton(input, platform);
        const flexContainer = sendBtn.closest('.flex') || sendBtn.parentElement;
        let targetNode = sendBtn;
        while (targetNode.parentElement && targetNode.parentElement !== flexContainer) {
          targetNode = targetNode.parentElement;
        }
        flexContainer.insertBefore(btn, targetNode);
      } else if (!sendBtn && existingBtn) {
        existingBtn.remove();
        cleanupUndo();
      }
    } else {
      if (input && !existingBtn) {
        const btn = createButton(input, platform);
        platform.injectFn(input, btn);
      }
    }
  };

  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(sync, delay);
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
