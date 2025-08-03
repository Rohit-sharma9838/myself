function showLiveDemo(event) {
  event.preventDefault();
  const iframe = document.getElementById("demo-frame");
  iframe.src = "https://rohit-sharma9838.github.io/myself/";
  iframe.style.height = "90vh";

  iframe.onload = () => {
    const iframeWindow = iframe.contentWindow;
    let scrollY = 0;
    const scrollStep = 2;
    const intervalDelay = 10;
    const intervalId = setInterval(() => {
      scrollY += scrollStep;
      iframeWindow.scrollTo(0, scrollY);
      if (scrollY + iframeWindow.innerHeight >= iframeWindow.document.body.scrollHeight) {
        clearInterval(intervalId);
      }
    }, intervalDelay);
  };
}
