document.addEventListener("DOMContentLoaded", function () {
    const demoBtn = document.getElementById("liveDemoBtn");
    const mainFrame = document.getElementById("mainFrame");

    demoBtn.addEventListener("click", function (e) {
      e.preventDefault(); // agar <a> hota to default rokte

      // 👇 Yahan apna actual portfolio ka URL daal
      const portfolioURL = "http://127.0.0.1:5500/myself-1/index.html";

      // YouTube iframe ke andar portfolio load karo
      mainFrame.src = portfolioURL;
    });
  });