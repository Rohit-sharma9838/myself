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

  // Error Checking
  const currentLang = editorSelect.value;
  const code = editorBox.value;

  if (currentLang === "html") {
    htmlCode = code;

    // Basic check for invalid tags (just for demo)
    const invalidTags = htmlCode.match(/<[^\/!a-z][^>]*>/gi);
    if (invalidTags) {
      errorBox.style.display = "block";
      errorBox.textContent = "🛑 Invalid HTML tag(s): " + invalidTags.join(", ");
      return;
    }

  } else if (currentLang === "css") {
    cssCode = code;

    // Try applying the CSS to a dummy element
    const dummy = document.createElement("div");
    try {
      dummy.style.cssText = cssCode;
    } catch (e) {
      errorBox.style.display = "block";
      errorBox.textContent = "🛑 CSS Error: " + e.message;
      return;
    }

  } else if (currentLang === "js") {
    jsCode = code;

    // JS syntax check using Function constructor
    try {
      new Function(jsCode);
    } catch (e) {
      errorBox.style.display = "block";
      errorBox.textContent = "🛑 JavaScript Error: " + e.message;
      return;
    }
  }

  // If all good, render output
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

// Receive error from iframe
window.addEventListener("message", (event) => {
  if (event.data.type === "error") {
    errorBox.style.display = "block";
    errorBox.textContent = "🛑 " + event.data.message;
  }
});

// Editor change
function loadEditor() {
  const selected = editorSelect.value;
  if (selected === "html") editorBox.value = htmlCode;
  else if (selected === "css") editorBox.value = cssCode;
  else if (selected === "js") editorBox.value = jsCode;
}

editorSelect.addEventListener("change", loadEditor);

editorBox.addEventListener("input", () => {
  const selected = editorSelect.value;
  if (selected === "html") htmlCode = editorBox.value;
  else if (selected === "css") cssCode = editorBox.value;
  else if (selected === "js") jsCode = editorBox.value;
});
