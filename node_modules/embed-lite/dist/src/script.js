const input = document.getElementById('url-input');
const btn = document.getElementById('render-btn');
const resultsContainer = document.getElementById('results-container');
const preview = document.getElementById('preview-output');
const code = document.getElementById('code-output');

function executeRenderer() {
    const url = input.value.trim();
    if (!url) return;

    try {
        // Evaluates library (either CDN or locally bridged)
        if (typeof window.embedLite === 'undefined') {
             throw new Error("Initialization Loading Error");
        }

        const result = window.embedLite.embed(url);
        
        if (result && result.html) {
            resultsContainer.style.display = 'flex';
            code.className = '';
            code.textContent = result.html;
            preview.innerHTML = result.html;
            
            // Mount any heavy JS dependencies recursively requested by providers (e.g. Twitter/Instagram)
            const scripts = preview.getElementsByTagName('script');
            for (let i = 0; i < scripts.length; i++) {
                const existing = scripts[i];
                const newScript = document.createElement('script');
                newScript.src = existing.src;
                newScript.async = true;
                document.body.appendChild(newScript);
            }
        } else {
            resultsContainer.style.display = 'flex';
            code.innerHTML = '<span class="error-state">Error: That URL format explicitly does not match the active internal registry schemas.</span>';
            preview.innerHTML = '';
        }
    } catch (e) {
        resultsContainer.style.display = 'flex';
        code.innerHTML = '<span class="error-state">Error: Invalid URL Scheme evaluation. Ensure string format is perfectly encoded.</span>';
        preview.innerHTML = '';
        console.error(e);
    }
}

btn.addEventListener('click', executeRenderer);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') executeRenderer();
});

document.getElementById('copy-btn').addEventListener('click', () => {
    const txt = code.textContent;
    if (txt && !txt.includes('Error')) {
        navigator.clipboard.writeText(txt);
        const copyBtn = document.getElementById('copy-btn');
        copyBtn.textContent = "Copied!";
        setTimeout(() => { copyBtn.textContent = "Copy Output"; }, 2000);
    }
});

input.addEventListener('input', (e) => {
    if(e.target.value.trim() === '') {
        resultsContainer.style.display = 'none';
    }
});

// Fire automatically if URL has '?url=' parameter! Very developer friendly for remote links.
window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search);
    if(params.has('url')) {
        input.value = params.get('url');
        setTimeout(executeRenderer, 500); // Buffer for remote script loads
    }
});