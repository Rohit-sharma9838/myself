document.addEventListener("DOMContentLoaded", function () {
    const demoBtn = document.getElementById("liveDemoBtn");
    const frame = document.getElementById("mainFrame");

    demoBtn.addEventListener("click", function (e) {
      e.preventDefault(); // prevent default link behavior

      // 👇 Apna portfolio URL ya demo URL yahan daal
      const portfolioURL = "http://127.0.0.1:5500/myself-1/index.html";  // ya koi live link

      frame.src = portfolioURL;
    });
  });