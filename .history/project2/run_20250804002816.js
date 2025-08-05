const editorBox = document.getElementById("editorBox");
const editorSelect = document.getElementById("editorSelect");
const output = document.getElementById("output");
const errorBox = document.getElementById("errorBox");

let htmlCode = "";
let cssCode = "";
let jsCode = "";

function runCode() {
  errorBox.style.display = "none";
  errorBox.textContent = "";

  const currentLang = editorSelect.value;
  const code = editorBox.value;

  // Update the code variables on run (important)
  if (currentLang === "html") {
    htmlCode = code;

    // Simple HTML tag validation (detect invalid tags like <h100>)
    const invalidTagMatch = htmlCode.match(/<\s*\/?\s*([a-zA-Z0-9]+)[^>]*>/g)?.filter(tag => {
      // Allowed common tags list (simple example)
      const allowedTags = ["html","head","body","div","span","p","a","img","h1","h2","h3","h4","h5","h6","br","hr","meta","link","script","style","input","button","form","label","ul","ol","li","table","thead","tbody","tr","td","th","footer","header","nav","section","article"];
      // Extract tag name only
      const tagName = tag.match(/<\s*\/?\s*([a-zA-Z0-9]+)/)[1].toLowerCase();
      return !allowedTags.includes(tagName);
    }) || [];

    if (invalidTagMatch.length > 0) {
      errorBox.style.display = "block";
      errorBox.textContent = "🛑 Invalid HTML tag(s): " + invalidTagMatch.join(", ");
      output.srcdoc = ""; // Clear output
      return;
    }

  } else if (currentLang === "css") {
    cssCode = code;

    // CSS validation by trying to set it on dummy element's style attribute
    const dummy = document.createElement("div");
    try {
      dummy.style.cssText = cssCode;
    } catch (e) {
      errorBox.style.display = "block";
      errorBox.textContent = "🛑 CSS Error: " + e.message;
      output.srcdoc = "";
      return;
    }
    // Further simple validation to detect some obvious mistakes
    if(cssCode.trim() === ""){
      // Empty CSS is fine
    } else if (!cssCode.includes("{") || !cssCode.includes("}")){
      errorBox.style.display = "block";
      errorBox.textContent = "🛑 CSS Error: Invalid syntax (missing { or })";
      output.srcdoc = "";
      return;
    }

  } else if (currentLang === "js") {
    jsCode = code;

    // JavaScript syntax check using Function constructor
    try {
      new Function(jsCode);
    } catch (e) {
      errorBox.style.display = "block";
      errorBox.textContent = "🛑 JavaScript Error: " + e.message;
      output.srcdoc = "";
      return;
    }
  }

  // If no error, show output
  const finalCode = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${cssCode}</style>
    </head>
    <body>
      ${htmlCode}
      <script>
        window.onerror = function(msg, url, line, col, error) {
          parent.postMessage({ type: 'error', message: msg + ' at line ' + line }, '*');
        };
        ${jsCode}
      <\/script>
    </body>
    </html>
  `;

  output.srcdoc = finalCode;
}

window.addEventListener("message", (event) => {
  if (event.data.type === "error") {
    errorBox.style.display = "block";
    errorBox.textContent = "🛑 " + event.data.message;
    output.srcdoc = ""; // Clear output on runtime error
  }
});

// Load code when language changes
editorSelect.addEventListener("change", () => {
  errorBox.style.display = "none";
  errorBox.textContent = "";

  const selected = editorSelect.value;
  if (selected === "html") editorBox.value = htmlCode;
  else if (selected === "css") editorBox.value = cssCode;
  else if (selected === "js") editorBox.value = jsCode;
});

// Update variables on typing but don't run code automatically
editorBox.addEventListener("input", () => {
  const selected = editorSelect.value;
  if (selected === "html") htmlCode = editorBox.value;
  else if (selected === "css") cssCode = editorBox.value;
  else if (selected === "js") jsCode = editorBox.value;
});
