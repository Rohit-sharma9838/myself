
  document.getElementById("show-video").addEventListener("click", function () {
    document.getElementById("video-container").style.display = "block";
    // Optional: Auto-play
    const iframe = document.getElementById("demo-video");
    const src = iframe.src;
    if (!src.includes("autoplay=1")) {
      iframe.src += "?autoplay=1";
    }
  });

