document.addEventListener("DOMContentLoaded", function () {
    const liveDemoButton = document.getElementById("liveDemoBtn");
    const mainFrame = document.getElementById("mainFrame");

    liveDemoButton.addEventListener("click", function () {
      // Apne portfolio ka actual link yahan daal
      const portfolioURL = "http://127.0.0.1:5500/myself-1/index.html"; // ya deployed link

      // Upar wale iframe ka src change kar de
      mainFrame.src = portfolioURL;
    });
  });