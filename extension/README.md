# Lakon Public — Chrome Extension

The companion extension for Lakon. Injects a button into Claude, ChatGPT, Gemini, and GitHub Copilot Chat to compress your prompts semantically, saving tokens and costs.

## Installation (Developer Mode)

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** using the toggle in the top-right corner.
3. Click the **Load unpacked** button.
4. Select the `extension` folder from this project directory.

## Features

- **Auto-Injection**: Detects prompt input areas on major AI platforms.
- **Semantic Compression**: Uses the Lakon backend to strip filler while preserving meaning.
- **Token Savings**: Shows exactly how many tokens you saved directly in the UI.
- **Privacy**: Only accesses the specific AI platforms listed in the manifest.

## Usage

1. Open any supported AI chat (e.g., [claude.ai](https://claude.ai)).
2. Type your prompt into the input box.
3. Click the **Lakon** button that appears near the input area.
4. Your prompt will be replaced with a compressed version.
5. Click the extension icon in your browser toolbar to see your last compression stats.
