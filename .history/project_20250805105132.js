function showLiveDemo(event) {
  event.preventDefault();
  const iframe = document.getElementById("demo-frame");
  iframe.src = "QRvideo.webm";
}
