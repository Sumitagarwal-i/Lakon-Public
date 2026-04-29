# ⚡ Lakon Public

> **Prompt compression for the era of long-context LLMs.**  
> Stop sending your prompts raw. Compress tokens, preserve intent, and save 50-80% on costs/latency.

---

## 🚀 The Product

Lakon is a browser extension that intelligently compresses your AI prompts before they reach Claude, ChatGPT, or Gemini. It doesn't just strip words—it restructures your signal to exploit how LLMs process attention (Primacy and Recency zones).

![Lakon Demo](https://via.placeholder.com/800x450?text=Lakon+Extension+Demo+Placeholder)

### **Before:** 
> "Hey, I hope you're doing well today. I was wondering if you could please help me understand the main differences between React and Vue, specifically focusing on how they handle state management and rendering performance, but keep it very simple for a beginner."

### **After (Lakon):**
> "Compare React vs Vue state management & rendering performance simply for beginner."

**Saved: 64% Tokens**

---

## 🛠️ Repository Structure

This repository contains the **Public Interface** of Lakon to build transparency and trust.

- `/extension`: The browser extension source code (injection logic, UI, and API interaction).
- `/web`: The official Lakon landing page and installation site (Built with Next.js & Tailwind).
- `/docs`: Visual guides and product documentation.

*Note: The backend compression engine and proprietary prompt-engineering logic are kept private to protect intellectual property.*

---

## 🔒 Privacy & Trust

Lakon is built on a **Zero-Retention** philosophy.

- **No Prompt Storage**: We do not store the text you compress. Prompts are processed in real-time and passed directly to the model.
- **Transparent Processing**: We use the Groq API for lightning-fast, stateless processing.
- **Local Control**: You can see exactly how the extension interacts with your browser in the `/extension` folder.
- **No Tracking**: We don't track your identity or browsing history.

---

## 🎨 Features

- **One-Click Compression**: A subtle ⚡ button appears next to the native "Send" button in your favorite AI tools.
- **Multi-Platform**: Native support for **Claude.ai**, **ChatGPT**, and **Gemini**.
- **Undo Support**: Instantly revert to your raw prompt if needed.
- **Live Feedback**: See exactly how many tokens you saved in real-time.

---

## 📥 Installation

### **For Users**
The easiest way to use Lakon is to download the pre-packaged extension from our [Official Site](https://lakon.vercel.app).

### **For Developers (Manual Install)**
1. Clone this repo.
2. Go to `chrome://extensions` in your browser.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the `/extension` folder.
5. (Optional) Point the `API_BASE` in `content.js` to your own backend.

---

## 🗺️ Roadmap

- [x] v0.1: Initial release for ChatGPT/Claude
- [x] v0.2: Gemini support + Undo logic
- [x] v0.3: Token savings UI feedback
- [ ] v0.4: Custom compression "Modes" (Strict vs. Creative)
- [ ] v0.5: API access for developers

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  Built with ⚡ by <a href="https://github.com/Sumitagarwal-i">Sumit Agarwal</a>
</p>
