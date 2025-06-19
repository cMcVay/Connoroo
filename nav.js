/* hamburger / dropdown for band list  */
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const menu   = document.getElementById('bandMenu');

  if (!toggle || !menu) return;

  // open / close on click
  toggle.addEventListener('click', () => menu.classList.toggle('open'));

  // close when a link is chosen
  menu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => menu.classList.remove('open'))
  );

  // close if the user clicks anywhere outside the menu or button
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove('open');
    }
  });

  // ⎋ key closes the menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') menu.classList.remove('open');
  });
});
