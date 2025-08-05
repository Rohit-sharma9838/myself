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

// CSS validation using temporary style element
function validateCSS(css) {
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  let rules;
  try {
    rules = style.sheet?.cssRules;
  } catch {
    // Catch syntax error in CSS parsing
    document.head.removeChild(style);
    return "CSS Syntax Error";
  }
  document.head.removeChild(style);

  if (!rules || rules.length === 0) {
    return "No valid CSS rules found";
  }
  return null;
}

function runCode() {
  errorBox.style.display = "none";
  errorBox.textContent = "";

  // Update current code according to selected editor
  const selected = editorSelect.value;
  if (selected === "html") htmlCode = editorBox.value;
  else if (selected === "css") cssCode = editorBox.value;
  else if (selected === "js") jsCode = editorBox.value;

  // Validate HTML if not empty
  if (htmlCode.trim()) {
    const htmlError = validateHTML(htmlCode);
    if (htmlError) {
      errorBox.style.display = "block";
      errorBox.textContent = "🛑 HTML Error: " + htmlError;
      output.srcdoc = "";
      return;
    }
  }

  // Validate CSS if not empty
  if (cssCode.trim()) {
    const cssError = validateCSS(cssCode);
    if (cssError) {
      errorBox.style.display = "block";
      errorBox.textContent = "🛑 CSS Error: " + cssError;
      output.srcdoc = "";
      return;
    }
  }

  // Validate JS syntax with Esprima if not empty
  if (jsCode.trim()) {
    try {
      esprima.parseScript(jsCode);
    } catch (e) {
      errorBox.style.display = "block";
      errorBox.textContent = `🛑 JavaScript Error: ${e.description} (Line ${e.lineNumber})`;
      output.srcdoc = "";
      return;
    }
  }

  // If no errors, build full HTML with CSS & JS and set iframe output
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

// Load selected editor's code into textarea
function loadEditor() {
  const selected = editorSelect.value;
  if (selected === "html") editorBox.value = htmlCode;
  else if (selected === "css") editorBox.value = cssCode;
  else if (selected === "js") editorBox.value = jsCode;

  errorBox.style.display = "none";
  errorBox.textContent = "";
}

// Auto close HTML tag when typing in HTML editor
editorBox.addEventListener("input", function(e) {
  if (editorSelect.value !== "html") return;

  const cursor = editorBox.selectionStart;
  const value = editorBox.value;

  // If last char typed is '>', try to auto-insert closing tag
  if (value[cursor - 1] === '>') {
    const tagMatch = value.slice(0, cursor).match(/<([a-zA-Z][a-zA-Z0-9]*)>$/);
    if (tagMatch) {
      const tagName = tagMatch[1];

      // void/self-closing tags don't get auto closing
      const voidTags = ["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"];
      if (voidTags.includes(tagName.toLowerCase())) return;

      const closingTag = `</${tagName}>`;

      // Insert closing tag at cursor position
      const newValue = value.slice(0, cursor) + closingTag + value.slice(cursor);
      editorBox.value = newValue;

      // Move cursor back between the tags so user can keep typing inside
      editorBox.selectionStart = editorBox.selectionEnd = cursor;
    }
  }

  // Save latest code
  htmlCode = editorBox.value;
});

// When editor selection changes, load corresponding code
editorSelect.addEventListener("change", loadEditor);

// Bind run button click event after DOM content loaded
document.addEventListener("DOMContentLoaded", () => {
  runBtn.addEventListener("click", runCode);
});

// Initialize editor with HTML code on page load
loadEditor();
