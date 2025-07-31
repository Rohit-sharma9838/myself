const skills = document.querySelectorAll('.skill-badge');
let current = 0;
const intervalDuration = 2000;

function applyHover() {
  skills.forEach(skill => skill.classList.remove('hovered'));
  skills[current].classList.add('hovered');
  current = (current + 1) % skills.length;
}

applyHover();
setInterval(applyHover, intervalDuration);
