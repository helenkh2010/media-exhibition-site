document.addEventListener("DOMContentLoaded", () => {
  /* FLOATING HEADER */

const heroSection = document.querySelector(".hero");
const floatingHeader = document.getElementById("floatingHeader");

if (heroSection && floatingHeader) {
  const toggleHeader = () => {
    const heroBottom =
      heroSection.getBoundingClientRect().bottom;

    if (heroBottom <= 0) {
      floatingHeader.classList.add("is-visible");
    } else {
      floatingHeader.classList.remove("is-visible");
    }
  };

  toggleHeader();

  window.addEventListener("scroll", toggleHeader);
}

  /* TIMELINE */
  const timelinePoints = document.querySelectorAll(".timeline__point");
  const timelineCards = document.querySelectorAll(".timeline-card");

  timelinePoints.forEach((point) => {
    point.addEventListener("click", () => {
      const currentIndex = point.dataset.timeline;

      timelinePoints.forEach((item) => item.classList.remove("is-active"));
      timelineCards.forEach((card) => card.classList.remove("is-active"));

      point.classList.add("is-active");

      const currentCard = document.querySelector(
        `.timeline-card[data-content="${currentIndex}"]`
      );

      if (currentCard) currentCard.classList.add("is-active");
    });
  });

/* PROJECTOR GALLERY */

const projectorImages = document.querySelectorAll(".projector-gallery__image");
const projectorPrev = document.querySelector(".projector-gallery__button--prev");
const projectorNext = document.querySelector(".projector-gallery__button--next");

let projectorIndex = 0;

function getProjectorVisibleCount() {
  if (window.innerWidth <= 860) return projectorImages.length;
  if (window.innerWidth <= 1050) return 3;
  return 4;
}

function showProjectorImages() {
  const visibleCount = getProjectorVisibleCount();

  projectorImages.forEach((image, index) => {
    const isVisible =
      index >= projectorIndex &&
      index < projectorIndex + visibleCount;

    image.classList.toggle("is-visible", isVisible);
  });
}

if (projectorImages.length) {
  showProjectorImages();

  if (projectorNext) {
    projectorNext.addEventListener("click", () => {
      const visibleCount = getProjectorVisibleCount();

      projectorIndex += visibleCount;

      if (projectorIndex >= projectorImages.length) {
        projectorIndex = 0;
      }

      showProjectorImages();
    });
  }

  if (projectorPrev) {
    projectorPrev.addEventListener("click", () => {
      const visibleCount = getProjectorVisibleCount();

      projectorIndex -= visibleCount;

      if (projectorIndex < 0) {
        projectorIndex = Math.max(
          0,
          projectorImages.length - visibleCount
        );
      }

      showProjectorImages();
    });
  }

  window.addEventListener("resize", () => {
    projectorIndex = 0;
    showProjectorImages();
  });
}

  /* LIGHT SWITCHER */

  const lightExperience = document.querySelector(".light-experience");
  const lightButtons = document.querySelectorAll(".light-control");
  const lightTitle = document.querySelector(".light-info__title");
  const lightText = document.querySelector(".light-info__text");
  const lightImages = document.querySelectorAll(
    ".light-gallery__image"
  );

  const lightData = {
    blue: {
      title: "Синий",
      text: "Синий свет создаёт ощущение глубины, холода, дистанции и технологичности. Он усиливает впечатление от медиа-среды."
    },

    violet: {
      title: "Фиолетовый",
      text: "Фиолетовый свет делает пространство более мистическим и погружающим, создавая ощущение нереальности среды."
    },

    red: {
      title: "Красный",
      text: "Красный свет воспринимается как эмоционально напряжённый и драматичный. Он быстро концентрирует внимание."
    },

    white: {
      title: "Белый",
      text: "Белый свет помогает показать пространство более нейтральным и материальным, подчёркивая форму и структуру объектов."
    }
  };

  lightButtons.forEach((button) => {
    button.addEventListener("click", () => {

      const light = button.dataset.light;

      /* active button */

      lightButtons.forEach((item) => {
        item.classList.remove("is-active");
      });

      button.classList.add("is-active");

      /* glow */

      if (lightExperience) {
        lightExperience.dataset.activeColor = light;
      }

      /* images */

      lightImages.forEach((image) => {

        image.classList.toggle(
          "is-visible",
          image.dataset.color === light
        );

      });

      /* text */

      if (lightTitle && lightText && lightData[light]) {

        lightTitle.textContent =
          lightData[light].title;

        lightText.textContent =
          lightData[light].text;

      }

    });
  });

/* INTERACTION PLAYGROUND */
const playground = document.querySelector(".interaction-playground");
const dragZone = document.querySelector(".interaction-playground__drag-zone");
const interactionImages = document.querySelectorAll(".interaction-playground img");

let isDragging = false;
let snakeOrder = [];
let trail = [];
let animationFrame = null;

if (playground && dragZone && interactionImages.length) {
  const shuffleImages = () => {
    snakeOrder = Array.from(interactionImages)
      .map((image) => ({ image, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((item) => item.image);
  };

  const getPoint = (clientX, clientY) => {
    const rect = playground.getBoundingClientRect();

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const addPointToTrail = (x, y) => {
    trail.unshift({ x, y });

    if (trail.length > 260) {
      trail = trail.slice(0, 260);
    }
  };

  const renderSnake = () => {
    if (!isDragging || !trail.length) return;

    const rect = playground.getBoundingClientRect();

    snakeOrder.forEach((image, index) => {
      const pointIndex = Math.min(index * 7, trail.length - 1);
      const point = trail[pointIndex];

      const imageRect = image.getBoundingClientRect();

      const imageCenterX =
        imageRect.left - rect.left + imageRect.width / 2;

      const imageCenterY =
        imageRect.top - rect.top + imageRect.height / 2;

      const offsetX = point.x - imageCenterX;
      const offsetY = point.y - imageCenterY;

      const scale = Math.max(1 - index * 0.018, 0.78);
      const blur = Math.min(index * 0.08, 1.2);
      const opacity = Math.max(1 - index * 0.035, 0.58);

      image.style.transitionDelay = "0s";
      image.style.transitionDuration = "0.12s";
      image.style.zIndex = 100 - index;
      image.style.opacity = opacity;
      image.style.filter = `blur(${blur}px) saturate(1.16)`;
      image.style.transform = `
        translate(${offsetX}px, ${offsetY}px)
        rotate(${offsetX * 0.01}deg)
        scale(${scale})
      `;
    });

    animationFrame = requestAnimationFrame(renderSnake);
  };

  const startDrag = (clientX, clientY) => {
    isDragging = true;
    trail = [];

    shuffleImages();

    const point = getPoint(clientX, clientY);

    for (let i = 0; i < 80; i++) {
      trail.push({ x: point.x, y: point.y });
    }

    playground.classList.add("is-dragging");

    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }

    renderSnake();
  };

  const drag = (clientX, clientY) => {
    if (!isDragging) return;

    const point = getPoint(clientX, clientY);
    addPointToTrail(point.x, point.y);
  };

  const endDrag = () => {
    if (!isDragging) return;

    isDragging = false;
    playground.classList.remove("is-dragging");

    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }

    interactionImages.forEach((image) => {
      image.style.transitionDelay = "0s";
      image.style.transitionDuration = ".65s";
      image.style.transform = "translate(0, 0) rotate(0deg) scale(1)";
      image.style.zIndex = "";
      image.style.opacity = "";
      image.style.filter = "";
    });
  };

  dragZone.addEventListener("mousedown", (event) => {
    startDrag(event.clientX, event.clientY);
  });

  window.addEventListener("mousemove", (event) => {
    drag(event.clientX, event.clientY);
  });

  window.addEventListener("mouseup", endDrag);

  dragZone.addEventListener("touchstart", (event) => {
    const touch = event.touches[0];
    startDrag(touch.clientX, touch.clientY);
  });

  dragZone.addEventListener(
    "touchmove",
    (event) => {
      event.preventDefault();
      const touch = event.touches[0];
      drag(touch.clientX, touch.clientY);
    },
    { passive: false }
  );

  dragZone.addEventListener("touchend", endDrag);
}

  /* IMAGE MODAL */
  const modal = document.createElement("div");
  modal.className = "image-modal";
  modal.innerHTML = `
    <button class="image-modal__close" type="button">×</button>
    <img class="image-modal__img" src="" alt="">
  `;
  document.body.appendChild(modal);

  const modalImage = modal.querySelector(".image-modal__img");
  const modalClose = modal.querySelector(".image-modal__close");

  const clickableImages = document.querySelectorAll(
    ".timeline-card__image img, .projector-gallery__image, .light-gallery__image, .interaction-playground img"
  );

  clickableImages.forEach((image) => {
    image.addEventListener("click", () => {
      modalImage.src = image.src;
      modalImage.alt = image.alt || "";
      modal.classList.add("is-open");
      document.body.classList.add("modal-open");
    });
  });

  function closeModal() {
    modal.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    modalImage.src = "";
  }

  modalClose.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });
});