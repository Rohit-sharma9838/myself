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

  // Update stored code before running
  const selected = editorSelect.value;
  if (selected === "html") htmlCode = editorBox.value;
  else if (selected === "css") cssCode = editorBox.value;
  else if (selected === "js") jsCode = editorBox.value;

  // Check JS syntax only if JS tab selected
  if (jsCode.trim() !== "") {
    try {
      esprima.parseScript(jsCode);
    } catch (err) {
      errorBox.style.display = "block";
      errorBox.textContent = "🛑 JavaScript Error: " + err.description + " (Line " + err.lineNumber + ")";
      output.srcdoc = ""; // Clear output on error
      return; // Stop further execution
    }
  }

  // If JS is valid or empty, show output
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

// Load editor content on tab switch
function loadEditor() {
  const selected = editorSelect.value;
  if (selected === "html") editorBox.value = htmlCode;
  else if (selected === "css") editorBox.value = cssCode;
  else if (selected === "js") editorBox.value = jsCode;

  errorBox.style.display = "none";
  errorBox.textContent = "";
}

editorSelect.addEventListener("change", loadEditor);
document.querySelector("button").addEventListener("click", runCode);

// Initialize on load
loadEditor();
runCode();
