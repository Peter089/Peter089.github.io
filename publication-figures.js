(() => {
  const viewer = document.querySelector('#figure-viewer');
  if (!viewer || typeof viewer.showModal !== 'function') return;

  const image = viewer.querySelector('.figure-viewer-image');
  const caption = viewer.querySelector('#figure-viewer-caption');
  const closeButton = viewer.querySelector('.figure-viewer-close');
  let trigger = null;
  let scrollPosition = 0;
  let backdropPointerDown = false;

  document.querySelectorAll('.publication-figure').forEach(button => {
    button.addEventListener('click', () => {
      const thumbnail = button.querySelector('img');
      trigger = button;
      scrollPosition = window.scrollY;
      image.src = thumbnail.src;
      image.alt = thumbnail.alt;
      viewer.setAttribute('aria-label', button.dataset.figureTitle);
      caption.textContent = button.dataset.figureCaption;
      viewer.showModal();
      document.documentElement.classList.add('figure-viewer-open');
      closeButton.focus({ preventScroll: true });
    });
  });

  closeButton.addEventListener('click', () => viewer.close());
  image.addEventListener('click', () => viewer.close());
  // Require both ends of the click to be on the backdrop, not a drag off the image.
  viewer.addEventListener('pointerdown', event => {
    backdropPointerDown = event.target === viewer;
  });
  viewer.addEventListener('click', event => {
    if (event.target === viewer && backdropPointerDown) viewer.close();
    backdropPointerDown = false;
  });
  // Native dialog handles Escape and keeps keyboard focus inside the viewer.
  viewer.addEventListener('close', () => {
    document.documentElement.classList.remove('figure-viewer-open');
    window.scrollTo({ top: scrollPosition, behavior: 'instant' });
    trigger?.focus({ preventScroll: true });
    image.removeAttribute('src');
  });
})();
