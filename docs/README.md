# Lakon Documentation

Welcome to the Lakon documentation! Lakon is an **AI Optimization & Continuity Engine** consisting of two main tools designed to improve how you interact with LLMs like Claude, ChatGPT, and Gemini.

## 1. Semantic Prompt Compressor

Lakon’s core utility is a prompt compressor that removes everything that wastes tokens—polite phrasing, redundant context, and scaffolding—while preserving every piece of signal the AI needs to answer correctly.

- **Fewer Tokens:** Averages 78% reduction in token size.
- **Same Quality:** The AI receives a denser, cleaner instruction, ensuring the response is equivalent or better.
- **Inline Extension:** Compresses prompts directly inside the input boxes of major AI chat interfaces.

## 2. Context Snapshots (Continuity Engine)

The Context Snapshot feature solves the problem of "losing the AI's attention" in massive, sprawling chat logs.

- **Map-Reduce Pipeline:** We chunk your massive chat log and run it through Llama 3.3 70B to extract your core goal, key decisions, hard constraints, and open tasks.
- **Clean Continuation Prompt:** Lakon generates a highly optimized, rich first-person briefing paragraph.
- **Resume Anywhere:** Paste the snapshot into a fresh AI chat window to instantly bring the model up to speed without bringing along the raw, messy history.

## Getting Started

1. **Browser Extension:** The fastest way to compress prompts. Download the latest version from our [official website](https://lakonai.vercel.app). See the `extension/` directory for source code.
2. **Playground (Web App):** A fully featured web playground for both Prompt Compression and Context Snapshots. Available at [lakonai.vercel.app/app](https://lakonai.vercel.app/app).

## API Reference

The Lakon backend is powered by a custom FastAPI server utilizing Groq for high-speed inference. It exposes endpoints for both compression (`/compress`) and context snapshots (`/snapshot`).

For detailed API usage, schema formats, and full interactive documentation, please visit the **Docs** section on our website: [lakonai.vercel.app/docs](https://lakonai.vercel.app/docs).

---

*Lakon is built on research into LLM attention mechanics (Primacy and Recency effects). By restructuring prompts and summarizing contexts, we ensure your AI always focuses on the signal, not the noise.*
