document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['lastTokensBefore', 'lastTokensAfter', 'lastReductionPct'], (data) => {
    const statsDiv = document.getElementById('stats');
    
    if (data.lastTokensBefore) {
      statsDiv.innerHTML = `
        <div class="stats-row">
          Last compression:<br>
          ${data.lastTokensBefore} → ${data.lastTokensAfter} tokens<br>
          (${data.lastReductionPct}% saved)
        </div>
      `;
    } else {
      statsDiv.innerHTML = `
        <p class="placeholder">
          Open Claude, ChatGPT, Gemini or Copilot and click the Lakon button on any prompt.
        </p>
      `;
    }
  });
});
