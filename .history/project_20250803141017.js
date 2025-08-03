function showLiveDemo(event) {
  event.preventDefault();
  const iframe = document.getElementById("demo-frame");
  iframe.src = "https://rohit-sharma9838.github.io/myself/";
}
setTimeout(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }, 1000);