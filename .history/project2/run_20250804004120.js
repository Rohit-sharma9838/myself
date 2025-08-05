const editorBox = document.getElementById("editorBox");
const editorSelect = document.getElementById("editorSelect");
const output = document.getElementById("output");
const errorBox = document.getElementById("errorBox");

let htmlCode = "";
let cssCode = "";
let jsCode = "";

// Simple HTML validation: check if each opening tag has a closing tag (no deep nesting check)
function validateHTML(html) {
  const regex = /<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
  let tags = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    tags.push(match[1]);
  }

  for (let tag of tags) {
    const closeTag = new RegExp(`</${tag}>`, "i");
    if (!closeTag.test(html)) {
      return `Tag <${tag}> is not properly closed.`;
    }
  }
  return null; // no error
}

function updatePreview() {
  const finalCode = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${cssCode}</style>
    </head>
    <body>
      ${htmlCode}
      <script>${jsCode}<\/script>
    </body>
    </html>
  `;
  output.srcdoc = finalCode;
}

function runCode() {
  errorBox.style.display = "none";
  errorBox.textContent = "";

  // Update current code from textarea
  const selected = editorSelect.value;
  if (selected === "html") htmlCode = editorBox.value;
  else if (selected === "css") cssCode = editorBox.value;
  else if (selected === "js") jsCode = editorBox.value;

  // Validate HTML if selected or if HTML code exists
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

  // No errors found, update output
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

function loadEditor() {
  const selected = editorSelect.value;
  if (selected === "html") {
    editorBox.value = htmlCode;
  } else if (selected === "css") {
    editorBox.value = cssCode;
  } else if (selected === "js") {
    editorBox.value = jsCode;
  }
  errorBox.style.display = "none";
  errorBox.textContent = "";
}

editorSelect.addEventListener("change", loadEditor);

// Optional: update stored code live as user types, but preview updates only on run
editorBox.addEventListener("input", () => {
  const selected = editorSelect.value;
  if (selected === "html") htmlCode = editorBox.value;
  else if (selected === "css") cssCode = editorBox.value;
  else if (selected === "js") jsCode = editorBox.value;
});

// Init editor content
loadEditor();
updatePreview();
