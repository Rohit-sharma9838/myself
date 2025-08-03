function showLiveDemo(event) {
  event.preventDefault();

  const iframe = document.getElementById("demo-frame");

  // Portfolio URL jo iframe me load karna hai
  const portfolioURL = "https://rohit-sharma9838.github.io/myself/";

  // Iframe src set karo
  iframe.src = portfolioURL;

  // Iframe ko full height de do taaki portfolio achhe se dikh sake
  iframe.style.height = "90vh"; // ya jitna chahiye

  // Iframe ke andar scroll automatic start karwane ke liye
  // Cross-origin restrictions ki wajah se direct iframe content scroll nahi kar sakte
  // Isliye portfolio ke andar (jo tumne banaya hai) ye scroll script hona chahiye

  // Yaha hum iframe load hone ke baad iframe ko focus karke scroll karne ki koshish karenge (works if same origin)
  iframe.onload = () => {
    try {
      const iframeWindow = iframe.contentWindow;

      // Auto scroll function inside iframe
      iframeWindow.eval(`
        function autoScroll() {
          let scrollY = 0;
          const scrollStep = 2;
          const intervalDelay = 10;
          const intervalId = setInterval(() => {
            scrollY += scrollStep;
            window.scrollTo(0, scrollY);
            if(scrollY + window.innerHeight >= document.body.scrollHeight) {
              clearInterval(intervalId);
            }
          }, intervalDelay);
        }
        setTimeout(autoScroll, 1000);
      `);
    } catch (e) {
      // Agar cross-origin ho, toh iframe ke andar script nahi chala sakte, isliye portfolio page me ye scroll script dalna best hai
      console.warn("Auto scroll inside iframe failed due to cross-origin policy. Please add scroll script inside your portfolio page.");
    }
  };
}
