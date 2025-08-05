document.addEventListener("DOMContentLoaded", () => {
  const editorBox = document.getElementById("editorBox");
  const editorSelect = document.getElementById("editorSelect");
  const output = document.getElementById("output");
  const errorBox = document.getElementById("errorBox");
  const runBtn = document.getElementById("runBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const downloadZipBtn = document.getElementById("downloadZipBtn");

  let htmlCode = "";
  let cssCode = "";
  let jsCode = "";

  function validateHTML(html) {
    const allowedTags = [
      "html", "head", "meta", "link", "title", "style", "script", "body",
      "div", "p", "span", "h1", "h2", "h3", "h4", "h5", "h6", "a",
      "ul", "li", "ol", "strong", "em", "br", "hr", "img", "input", "button",
      "section", "article", "header", "footer", "nav", "main", "form", "label",
      "textarea", "select", "option", "table", "tr", "td", "th", "thead", "tbody"
    ];

    const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
    const stack = [];
    let match;

    while ((match = tagRegex.exec(html)) !== null) {
      const tag = match[1].toLowerCase();
      const isClosing = match[0].startsWith("</");

      if (!allowedTags.includes(tag)) {
        return `Invalid tag found: <${tag}>`;
      }

      const voidTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
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

  function runCode() {
    errorBox.style.display = "none";
    errorBox.textContent = "";

    const selected = editorSelect.value;
    if (selected === "html") htmlCode = editorBox.value;
    else if (selected === "css") cssCode = editorBox.value;
    else if (selected === "js") jsCode = editorBox.value;

    if (htmlCode.trim()) {
      const htmlError = validateHTML(htmlCode);
      if (htmlError) {
        errorBox.style.display = "block";
        errorBox.textContent = "🛑 HTML Error: " + htmlError;
        output.srcdoc = "";
        output.style.display = "none";
        return;
      }
    }

    if (cssCode.trim()) {
      const cssError = validateCSS(cssCode);
      if (cssError) {
        errorBox.style.display = "block";
        errorBox.textContent = "🛑 CSS Error: " + cssError;
        output.srcdoc = "";
        output.style.display = "none";
        return;
      }
    }

    if (jsCode.trim()) {
      try {
        esprima.parseScript(jsCode);
      } catch (e) {
        errorBox.style.display = "block";
        const line = e.lineNumber || e.line || "unknown";
        errorBox.textContent = `🛑 JavaScript Error: ${e.message} (Line ${line})`;
        output.srcdoc = "";
        output.style.display = "none";
        return;
      }
    }

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
    output.style.display = "block";
  }

  function loadEditor() {
    const selected = editorSelect.value;
    if (selected === "html") editorBox.value = htmlCode;
    else if (selected === "css") editorBox.value = cssCode;
    else if (selected === "js") editorBox.value = jsCode;

    errorBox.style.display = "none";
    errorBox.textContent = "";
  }

  editorBox.addEventListener("input", function () {
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

  editorSelect.addEventListener("change", loadEditor);
  runBtn.addEventListener("click", runCode);

  downloadBtn?.addEventListener("click", () => {
    const fullHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>My Exported Page</title>
        <style>${cssCode}</style>
      </head>
      <body>
        ${htmlCode}
        <script>
          ${jsCode}
        <\/script>
      </body>
      </html>
    `;

    const blob = new Blob([fullHTML], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "my-code.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // ✅ Working ZIP Download Logic
  downloadZipBtn?.addEventListener("click", () => {
    const zip = new JSZip();

    zip.file("index.html", htmlCode || "<!-- Empty HTML -->");
    zip.file("style.css", cssCode || "/* Empty CSS */");
    zip.file("script.js", jsCode || "// Empty JS");

    zip.generateAsync({ type: "blob" }).then(function (content) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "code-files.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  });

  loadEditor();
});
