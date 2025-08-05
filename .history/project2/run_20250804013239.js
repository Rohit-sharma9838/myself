const editorBox = document.getElementById("editorBox");
const editorSelect = document.getElementById("editorSelect");
const output = document.getElementById("output");
const errorBox = document.getElementById("errorBox");
const runBtn = document.getElementById("runBtn");

let htmlCode = "";
let cssCode = "";
let jsCode = "";

// Basic HTML validation for proper closing tags
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

// Basic CSS validation by injecting style and checking rules
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

// Run and validate code on Run button click
function runCode() {
  errorBox.style.display = "none";
  errorBox.textContent = "";

  const selected = editorSelect.value;
  if (selected === "html") htmlCode = editorBox.value;
  else if (selected === "css") cssCode = editorBox.value;
  else if (selected === "js") jsCode = editorBox.value;

  // Validate HTML
  if (htmlCode.trim()) {
    const htmlError = validateHTML(htmlCode);
    if (htmlError) {
      showError("HTML Error: " + htmlError);
      return;
    }
  }

  // Validate CSS
  if (cssCode.trim()) {
    const cssError = validateCSS(cssCode);
    if (cssError) {
      showError("CSS Error: " + cssError);
      return;
    }
  }

  // Validate JS using Esprima
  if (jsCode.trim()) {
    try {
      esprima.parseScript(jsCode);
    } catch (e) {
      const line = e.lineNumber || e.line || "unknown";
      showError(`JavaScript Error: ${e.message} (Line ${line})`);
      return;
    }
  }

  // Build final combined HTML + CSS + JS for iframe
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
          document.body.insertAdjacentHTML('beforeend', '<pre style="color:red; white-space: pre-wrap;">Runtime Error: ' + e.message + '</pre>');
        }
      <\/script>
    </body>
    </html>
  `;

  output.srcdoc = finalCode;
  output.style.display = "block";
}

// Show error message in errorBox and hide output iframe
function showError(message) {
  errorBox.style.display = "block";
  errorBox.textContent = "🛑 " + message;
  output.srcdoc = "";
  output.style.display = "none";
}

// Load current selected language code into editor textarea
function loadEditor() {
  const selected = editorSelect.value;
  if (selected === "html") editorBox.value = htmlCode;
  else if (selected === "css") editorBox.value = cssCode;
  else if (selected === "js") editorBox.value = jsCode;

  errorBox.style.display = "none";
  errorBox.textContent = "";
}

// Auto closing tag feature for HTML editor
editorBox.addEventListener("input", function() {
  const selected = editorSelect.value;

  const cursor = editorBox.selectionStart;
  const value = editorBox.value;

  if (selected === "html") {
    if (value[cursor - 1] === '>') {
      const tagMatch = value.slice(0, cursor).match(/<([a-zA-Z][a-zA-Z0-9]*)>$/);
      if (tagMatch) {
        const tagName = tagMatch[1];
        const closingTag = `</${tagName}>`;

        const newValue = value.slice(0, cursor) + closingTag + value.slice(cursor);
        editorBox.value = newValue;

        editorBox.selectionStart = editorBox.selectionEnd = cursor;
      }
    }
    htmlCode = editorBox.value;
  } else if (selected === "css") {
    cssCode = editorBox.value;
  } else if (selected === "js") {
    jsCode = editorBox.value;
  }
});

// Change editor content when user switches language
editorSelect.addEventListener("change", loadEditor);

// Run button click triggers runCode
runBtn.addEventListener("click", runCode);

// Initial load
loadEditor();
