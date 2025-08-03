window.onload = function() {
  let scrollY = 0;
  const scrollStep = 2; // pixels to scroll each step
  const intervalDelay = 20; // milliseconds

  const scrollInterval = setInterval(() => {
    scrollY += scrollStep;
    window.scrollTo(0, scrollY);
    if (scrollY + window.innerHeight >= document.body.scrollHeight) {
      clearInterval(scrollInterval);
    }
  }, intervalDelay);
};
