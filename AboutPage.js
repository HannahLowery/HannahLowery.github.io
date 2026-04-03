// Swipe in transition
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('swipeLeftOverlay').classList.add('exit');
  }, 100);
});

// Section scrolling
const wrapper = document.getElementById('about-wrapper');
const sections = document.querySelectorAll('.about-section');
let current = 0;
let isScrolling = false;

function goTo(index) {
  if (index < 0 || index >= sections.length) return;
  current = index;
  wrapper.style.transform = `translateY(-${current * 100}vh)`;
  isScrolling = true;

  // Update active thumbnail
  document.querySelectorAll('.slide-thumb').forEach((thumb, i) => {
    thumb.classList.toggle('active', i === current);
  });

  setTimeout(() => { isScrolling = false; }, 900);
}

// Click thumbnail to jump to section
document.querySelectorAll('.slide-thumb').forEach((thumb) => {
  thumb.addEventListener('click', () => {
    const index = parseInt(thumb.getAttribute('data-index'));
    goTo(index);
  });
});

// Mouse wheel
window.addEventListener('wheel', (e) => {
  if (isScrolling) return;
  if (e.deltaY > 0) goTo(current + 1);
  else goTo(current - 1);
});

// Arrow keys
window.addEventListener('keydown', (e) => {
  if (isScrolling) return;
  if (e.key === 'ArrowDown') goTo(current + 1);
  if (e.key === 'ArrowUp') goTo(current - 1);
});

// Back button
document.querySelector('.back-btn').addEventListener('click', () => {
  const overlay = document.getElementById('swipeLeftOverlay');
  overlay.style.right = '100%';
  overlay.style.transition = 'none';

  setTimeout(() => {
    overlay.style.transition = 'right 0.8s cubic-bezier(0.76, 0, 0.24, 1)';
    overlay.style.right = '0';
  }, 50);

  setTimeout(() => {
    window.location.href = 'Homepage.html';
  }, 800);
});

//transition to contact page
document.querySelector('.lets-connect').addEventListener('click', () => {
  const overlay = document.getElementById('swipeLeftOverlay');
  overlay.style.right = '100%';
  overlay.style.transition = 'none';

  setTimeout(() => {
    overlay.style.transition = 'right 0.8s cubic-bezier(0.76, 0, 0.24, 1)';
    overlay.style.right = '0';
  }, 50);

  setTimeout(() => {
    window.location.href = 'ContactPage.html';
  }, 800);
});