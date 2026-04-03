//transition to homepage
setTimeout(() => {
  // Swipe panel slides down from top covering the page
  document.getElementById('swipeOverlay').classList.add('active');

  // Then redirect once panel has fully covered screen
  setTimeout(() => {
    window.location.href = 'Homepage.html';
  }, 800); // matches transition duration

}, 8000);

//sound effects
const typingSound = document.getElementById('typingSound');
const introSound = document.getElementById('introSound');

window.addEventListener('load', () => {
  introSound.volume = 0.5;
  introSound.play().catch(() => {
    document.addEventListener('click', () => introSound.play(), { once: true });
  });

  setTimeout(() => {
    typingSound.volume = 0.4;
    typingSound.loop = true;
    typingSound.play();
  }, 4500);

  setTimeout(() => {
    typingSound.pause();
    typingSound.currentTime = 0;
  }, 6500);

  setTimeout(() => {
    typingSound.play();
  }, 7300);

  setTimeout(() => {
    typingSound.pause();
    typingSound.currentTime = 0;
  }, 7800);
});