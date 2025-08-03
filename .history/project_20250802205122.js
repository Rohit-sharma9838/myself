document.getElementById("liveDemoBtn").addEventListener("click", function () {
    const frame = document.getElementById("mainFrame");

    // 👇 Yahan apna actual portfolio ka URL daal
    frame.src = "http://127.0.0.1:5500/myself-1/index.html";
  });