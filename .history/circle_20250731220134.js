const skills = document.querySelectorAll('.skill-badge');
let current = 0;
const hoverDuration = 1500; // milliseconds icon par hover rahega
const intervalDuration = 2000; // har 2 second me next icon pe hover

function applyHover() {
  // Remove hovered class from all
  skills.forEach(skill => skill.classList.remove('hovered'));
  
  // Add hovered class to current skill
  skills[current].classList.add('hovered');
  
  // Update index for next hover
  current = (current + 1) % skills.length;
}

// Start loop
applyHover();
setInterval(applyHover, intervalDuration);
