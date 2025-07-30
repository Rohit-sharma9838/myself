const toggleBtn = document.getElementById('menu-toggle');
const nav = document.getElementById('navbar');

toggleBtn.addEventListener('click', () => {
  nav.classList.toggle('active');
});
