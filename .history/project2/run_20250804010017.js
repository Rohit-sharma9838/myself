const editorBox = document.getElementById("editorBox");
const editorSelect = document.getElementById("editorSelect");
const output = document.getElementById("output");
const errorBox = document.getElementById("errorBox");
const runBtn = document.getElementById("runBtn");

let htmlCode = "";
let cssCode = "";
let jsCode = "";

// Basic HTML validation to check if tags are properly closed
function validateHTML(html) {
  const voidTags = ["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"];
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
  const stack = [];
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    const tag = match[1].toLowerCase();
    const isClosing = match[0].startsWith("</");
    if (!voidTags.includes(tag)) {
      if (!isClosing) {
        stack.push(tag);
      } else {
        if (stack.length === 0) return `Unexpected closing tag </${tag}>`;
        const lastTag = stack.pop();
        if (lastTag !== tag) return `Tag <${lastTag}> is not properly closed before </${tag}>`;
      }
    }
  }
  if (stack.length > 0) {
    return `Tag <${stack[stack.length - 1]}> is not closed`;
  }
  return null;
}

function runCode() {
  // Clear error box
  errorBox.style.display = "none";
  errorBox.textContent = "";

  // Update current code based on selected editor
  const selected = editorSelect.value;
  if (selected === "html") htmlCode = editorBox.value;
  else if (selected === "css") cssCode = editorBox.value;
  else if (selected === "js") jsCode = editorBox.value;

  // Validate HTML
  if (htmlCode.trim() !== "") {
    const htmlError = validateHTML(htmlCode);
    if (htmlError) {
      errorBox.style.display = "block";
      errorBox.textContent = "🛑 HTML Error: " + htmlError;
      output.srcdoc = "";
      return;
    }
  }

  // Validate JS syntax with Esprima (make sure esprima lib included in your HTML)
  if (jsCode.trim() !== "") {
    try {
      esprima.parseScript(jsCode);
    } catch (e) {
      errorBox.style.display = "block";
      errorBox.textContent = `🛑 JavaScript Error: ${e.description} (Line ${e.lineNumber})`;
      output.srcdoc = "";
      return;
    }
  }

  // No errors — build final code and show output
  const finalCode = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${cssCode}</style>
    </head>
    <body>
      ${htmlCode}
      <script>
        try {
          ${jsCode}
        } catch (e) {
          document.body.insertAdjacentHTML('beforeend', '<pre style="color:red;">Runtime Error: ' + e.message + '</pre>');
        }
      <\/script>
    </body>
    </html>
  `;

  output.srcdoc = finalCode;
}

// Load selected editor content to textarea
function loadEditor() {
  const selected = editorSelect.value;
  if (selected === "html") editorBox.value = htmlCode;
  else if (selected === "css") editorBox.value = cssCode;
  else if (selected === "js") editorBox.value = jsCode;

  errorBox.style.display = "none";
  errorBox.textContent = "";
}

// Update stored code when user types, but no output update here (only on run)
editorBox.addEventListener("input", () => {
  const selected = editorSelect.value;
  if (selected === "html") htmlCode = editorBox.value;
  else if (selected === "css") cssCode = editorBox.value;
  else if (selected === "js") jsCode = editorBox.value;
});

editorSelect.addEventListener("change", () => {
  loadEditor();
});

runBtn.addEventListener("click", runCode);

// Initialize textarea with html content
loadEditor();


function validateCSS(css) {
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const sheet = style.sheet;
  const rules = sheet?.cssRules;

  document.head.removeChild(style);

  if (!rules || rules.length === 0) {
    return "Invalid CSS syntax or empty rule";
  }

  return null;
}

