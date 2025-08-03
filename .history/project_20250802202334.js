// Jaise hi page load ho, ye code ready hoga
document.addEventListener("DOMContentLoaded", function () {
  // Button aur iframe dono ko access karo
  const liveDemoButton = document.getElementById("liveDemoBtn");
  const videoFrame = document.getElementById("videoFrame");

  // Button click hone par iframe me portfolio load karo
  liveDemoButton.addEventListener("click", function (e) {
    e.preventDefault(); // Agar button <a> hai to default action roko

    // Portfolio ka path (agar Live Server se run kar rahe ho)
    const portfolioURL = "http://127.0.0.1:5500/myself-1/index.html"; // ← Yahan apna URL set karo

    // iframe me portfolio ko load karo
    videoFrame.src = portfolioURL;
  });
});
