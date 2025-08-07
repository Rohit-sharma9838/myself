const text = "I am a motivated and quick-learning fresher with hands-on experience in frontend development using HTML, CSS and JavaScript. I have a basic understanding of backend technologies like C & C++, JAVA and python and databases such as SQL, MySQL and MongoDB. I am eager to apply my skills and grow as a developer while contributing effectively to a dynamic team environment. I am also familiar with version control using Git and debugging tools like Chrome DevTools and Postman.";
  const typingSpeed = 150;
  const erasingSpeed = 250;
  const delay = 1500;

  let index = 0;
  let isDeleting = false;
  const element = document.getElementById("typing");

  function type() {
    if (!isDeleting && index <= text.length) {
      element.textContent = text.substring(0, index);
      index++;
      setTimeout(type, typingSpeed);
    } else if (isDeleting && index >= 0) {
      element.textContent = text.substring(0, index);
      index--;
      setTimeout(type, erasingSpeed);
    } 

    if (index === text.length) {
      isDeleting = true;
      setTimeout(type, delay);
    } else if (index === 0 && isDeleting) {
      isDeleting = false;
      setTimeout(type, typingSpeed);
    }
  }

  type();