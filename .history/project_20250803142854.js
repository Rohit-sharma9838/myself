window.onload = function() {
  let scrollPos = 0;
  const scrollStep = 2;
  const delay = 20;
  const maxScroll = document.body.scrollHeight - window.innerHeight;

  const interval = setInterval(() => {
    scrollPos += scrollStep;
    if(scrollPos >= maxScroll) {
      clearInterval(interval);
    }
    window.scrollTo(0, scrollPos);
  }, delay);
};
