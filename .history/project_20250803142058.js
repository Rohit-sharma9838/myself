  function autoScroll() {
    let scrollY = 0;
    const scrollStep = 2; // pixels scroll har step mein
    const intervalDelay = 10; // milliseconds delay

    const intervalId = setInterval(() => {
      scrollY += scrollStep;
      window.scrollTo(0, scrollY);

      if (scrollY + window.innerHeight >= document.body.scrollHeight) {
        clearInterval(intervalId);
      }
    }, intervalDelay);
  }

  // Page load hone ke 1 second baad scroll shuru karo
  window.onload = () => {
    setTimeout(autoScroll, 1000);
  };

