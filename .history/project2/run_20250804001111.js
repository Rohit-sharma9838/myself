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

    // Listen for errors from iframe
    window.addEventListener("message", (event) => {
      if (event.data.type === "error") {
        errorBox.style.display = "block";
        errorBox.textContent = "🛑 " + event.data.message;
      }
    });


    function loadEditor() {
      const selected = editorSelect.value;
      if (selected === "html") {
        editorBox.value = htmlCode;
      } else if (selected === "css") {
        editorBox.value = cssCode;
      } else if (selected === "js") {
        editorBox.value = jsCode;
      }
    }

    editorBox.addEventListener("input", () => {
      const selected = editorSelect.value;
      if (selected === "html") {
        htmlCode = editorBox.value;
      } else if (selected === "css") {
        cssCode = editorBox.value;
      } else if (selected === "js") {
        jsCode = editorBox.value;
      }
      updatePreview();
    });

    editorSelect.addEventListener("change", loadEditor);

    // Init on load
    loadEditor();
    updatePreview();
    editorBox.addEventListener("input", function(e) {
  const value = editorBox.value;
  const cursor = editorBox.selectionStart;

  // Check if last typed char is ">"
  if (value[cursor - 1] === ">") {
    const tagMatch = value.slice(0, cursor).match(/<(\w+)>$/);
    if (tagMatch) {
      const tagName = tagMatch[1];
      const closeTag = `</${tagName}>`;

      // Insert close tag at cursor
      const newValue = value.slice(0, cursor) + closeTag + value.slice(cursor);
      editorBox.value = newValue;

      // Move cursor between tags
      editorBox.selectionStart = editorBox.selectionEnd = cursor;
    }
  }

  // Update stored code
  const selected = editorSelect.value;
  if (selected === "html") htmlCode = editorBox.value;
  else if (selected === "css") cssCode = editorBox.value;
  else if (selected === "js") jsCode = editorBox.value;

  updatePreview();
});
