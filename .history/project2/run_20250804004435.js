const editorBox = document.getElementById("editorBox");
const editorSelect = document.getElementById("editorSelect");
const output = document.getElementById("output");
const errorBox = document.getElementById("errorBox");
const runBtn = document.getElementById("runBtn");

let htmlCode = "";
let cssCode = "";
let jsCode = "";

// Simple HTML tag validation (checks if every opened tag has a closing tag)
function validateHTML(html) {
  const voidTags = ["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"];
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
  let tags = [];
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    const tag = match[1].toLowerCase();
    const isClosing = match[0].startsWith("</");
    if (!voidTags.includes(tag)) {
      if (!isClosing) {
        tags.push(tag);
      } else {
        if (tags.length === 0) return `Unexpected closing tag </${tag}>`;
        const last = tags.pop();
        if (last !== tag) return `Tag <${last}> not properly closed before </${tag}>`;
      }
    }
  }
  if (tags.length > 0) return `Tag <${tags[tags.length-1]}> not closed`;
  return null;
}

// Automatic closing tag insertion when user types '>'
editorBox.addEventListener("keyup", (e) => {
  if (editorSelect.value !== "html") return; // only for HTML

  if (e.key === ">" || e.key === "Enter") {
    const val = editorBox.value;
    const pos = editorBox.selectionStart;
    // Get text before cursor and find last tag typed
    const leftText = val.slice(0, pos);
    const tagMatch = leftText.match(/<([a-zA-Z][a-zA-Z0-9]*)[^>]*>$/);
    if (tagMatch) {
      const tagName = tagMatch[1];
      // Avoid auto closing for void tags
      const voidTags = ["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"];
      if (!voidTags.includes(tagName.toLowerCase())) {
        // Check if just typed closing tag already
        const rightText = val.slice(pos);
        if (!rightText.startsWith(`</${tagName}>`)) {
          const newVal = val.slice(0, pos) + `</${tagName}>` + val.slice(pos);
          editorBox.value = newVal;
          // Set cursor between tags
          editorBox.selectionStart = editorBox.selectionEnd = pos;
        }
      }
    }
  }
});

function loadEditor() {
  const selected = editorSelect.value;
  if (selected === "html") editorBox.value = htmlCode;
  else if (selected === "css") editorBox.value = cssCode;
  else if (selected === "js") editorBox.value = jsCode;

  errorBox.textContent = "";
  errorBox.style.display = "none";
}

function runCode() {
  errorBox.style.display = "none";
  errorBox.textContent = "";

  const selected = editorSelect.value;
  if (selected === "html") htmlCode = editorBox.value;
  else if (selected === "css") cssCode = editorBox.value;
  else if (selected === "js") jsCode = editorBox.value;

  // Validate HTML if not empty
  if (htmlCode.trim() !== "") {
    const htmlError = validateHTML(htmlCode);
    if (htmlError) {
      errorBox.style.display = "block";
      errorBox.textContent = "🛑 HTML Error: " + htmlError;
      output.srcdoc = "";
      return;
    }
  }

  // Validate JS syntax if JS code exists
  if (jsCode.trim() !== "") {
    try {
      esprima.parseScript(jsCode);
    } catch (err) {
      errorBox.style.display = "block";
      errorBox.textContent = `🛑 JavaScript Error: ${err.description} (Line ${err.lineNumber})`;
      output.srcdoc = "";
      return;
    }
  }

  // No errors, update iframe
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
        } catch(e) {
          document.body.innerHTML += '<pre style="color:red;">Runtime Error: ' + e.message + '</pre>';
        }
      <\/script>
    </body>
    </html>
  `;
  output.srcdoc = finalCode;
}

// Update stored code on typing (to not lose changes)
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

// Initialize
loadEditor();