/*Tranisiton from HomePage.html */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('swipeRightOverlay').classList.add('exit');
  }, 100);
});

//Transition to HomePage.html
document.querySelector('.back-btn').addEventListener('click', () => {
  document.getElementById('swipeBackOverlay').classList.add('active');

  setTimeout(() => {
    window.location.href = 'HomePage.html';
  }, 800);
});