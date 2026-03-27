document.addEventListener("DOMContentLoaded", () => {

  const slider = document.getElementById("movieSlider");
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");

  let index = 0;

  /* how many movies visible */
  function getVisibleCount() {
    const w = window.innerWidth;

    if (w <= 420) return 1;
    if (w <= 640) return 2;
    if (w <= 900) return 3;
    if (w <= 1200) return 4;

    return 5;
  }

  function getMovieWidth() {
    const movie = slider.children[0];
    const gap = 24; // same as CSS gap
    return movie.getBoundingClientRect().width + gap;
  }

  function updateButtons(visible, total) {

    /* LEFT BUTTON */
    if (index <= 0) {
      prevBtn.style.opacity = "0";
      prevBtn.style.pointerEvents = "none";
    } else {
      prevBtn.style.opacity = "1";
      prevBtn.style.pointerEvents = "auto";
    }

    /* RIGHT BUTTON */
    if (index + visible >= total) {
      nextBtn.style.opacity = "0";
      nextBtn.style.pointerEvents = "none";
    } else {
      nextBtn.style.opacity = "1";
      nextBtn.style.pointerEvents = "auto";
    }
  }

  function updateSlider() {

    const visible = getVisibleCount();
    const total = slider.children.length;

    /* prevent overflow index */
    if (index + visible > total) {
      index = Math.max(0, total - visible);
    }

    const moveAmount = index * getMovieWidth();

    slider.style.transform = `translateX(-${moveAmount}px)`;

    updateButtons(visible, total);
  }

  /* NEXT */
  nextBtn.addEventListener("click", () => {
    const visible = getVisibleCount();
    const total = slider.children.length;

    if (index + visible < total) {
      index += visible; // move by screen size
      updateSlider();
    }
  });

  /* PREV */
  prevBtn.addEventListener("click", () => {
    const visible = getVisibleCount();

    index -= visible;
    if (index < 0) index = 0;

    updateSlider();
  });

  /* RESIZE */
  window.addEventListener("resize", () => {
    updateSlider();
  });

  updateSlider();
});

const buttons = document.querySelectorAll('[data-accordion-target]');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.querySelector(btn.dataset.accordionTarget);
    const icon = btn.querySelector('[data-accordion-icon]');
    const isHidden = target.classList.contains('hidden');

    // Collapse all others
    document.querySelectorAll('[id^="accordion-collapse-body"]').forEach(b => {
      if (b !== target && !b.classList.contains('hidden')) {
        const svg = document.querySelector(`[data-accordion-target="#${b.id}"] svg[data-accordion-icon]`);
        if(svg) svg.classList.remove('rotate-180');

        // Smooth collapse
        b.style.maxHeight = b.scrollHeight + "px"; // ensure current height
        requestAnimationFrame(() => b.style.maxHeight = "0");

        const collapseHandler = () => {
          b.classList.add('hidden');
          b.removeEventListener('transitionend', collapseHandler);
        };
        b.addEventListener('transitionend', collapseHandler);
      }
    });

    if(isHidden) {
      // Expand
      target.classList.remove('hidden');
      icon.classList.add('rotate-180');

      requestAnimationFrame(() => target.style.maxHeight = target.scrollHeight + "px");
    } else {
      // Collapse current
      icon.classList.remove('rotate-180');
      target.style.maxHeight = target.scrollHeight + "px";
      requestAnimationFrame(() => target.style.maxHeight = "0");

      const collapseHandler = () => {
        target.classList.add('hidden');
        target.removeEventListener('transitionend', collapseHandler);
      };
      target.addEventListener('transitionend', collapseHandler);
    }
  });
});