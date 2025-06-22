document.addEventListener('DOMContentLoaded', () => {
  const boxes = document.querySelectorAll('.info-box');
  boxes.forEach((box, index) => {
    box.style.opacity = 0;
    box.style.transform = 'translateY(20px)';
    setTimeout(() => {
      box.style.transition = 'all 0.6s ease';
      box.style.opacity = 1;
      box.style.transform = 'translateY(0)';
    }, index * 200);
  });
});
