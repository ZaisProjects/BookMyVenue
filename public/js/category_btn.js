document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('#carouselExampleCaptions');
  const buttons = document.querySelectorAll('.category-btn');

  carousel.addEventListener('slid.bs.carousel', function (e) {
    const index = e.to; // index of active slide

    // Remove active from all buttons
    buttons.forEach(btn => btn.classList.remove('active'));

    // Add active to the matching one
    const activeBtn = document.querySelector(`.category-btn[data-category="${index}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }
  });
});
