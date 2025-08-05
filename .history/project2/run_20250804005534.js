 const editorBox = document.getElementById("editorBox");
    const editorSelect = document.getElementById("editorSelect");
    const output = document.getElementById("output");

    let htmlCode = "";
    let cssCode = "";
    let jsCode = "";

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