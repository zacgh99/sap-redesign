const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (start, end, amount) => start + (end - start) * amount;

function debounce(fn, wait = 150) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

  initCustomCursor({ hasFinePointer });
  initMobileMenu({ prefersReducedMotion });
  initHeaderScroll();
  initHeroCanvas({ prefersReducedMotion });
  initWebNavigation({ prefersReducedMotion });
  initScrollAnimations({ prefersReducedMotion });
  initHeroParallax({ prefersReducedMotion });
  initHelpChooser({ prefersReducedMotion });
  initContactPrefill();
  initServiceCardTilt({ prefersReducedMotion, hasFinePointer });
  initFAQ();
  initContactForm();
  initReviewForm();
  initFieldValidation();
  initStaggerDelays();
  initSmoothAnchors({ prefersReducedMotion });
  initLazyImages();
  initPhoneTracking();
  initReviewsCarousel();
  initQuerySuccessStates({ prefersReducedMotion });
  initConsoleBrand();
});

// ======================================================
// CUSTOM CURSOR
// ======================================================
function initCustomCursor({ hasFinePointer }) {
  const cursor = $("#cursor");
  const cursorRing = $("#cursorRing");

  if (!cursor || !cursorRing || !hasFinePointer) {
    document.body.classList.remove("cursor-hover");
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
    cursor.style.opacity = "1";
    cursorRing.style.opacity = "1";
  });

  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
    cursorRing.style.opacity = "0";
    document.body.classList.remove("cursor-hover");
  });

  document.addEventListener("mouseenter", () => {
    cursor.style.opacity = "1";
    cursorRing.style.opacity = "1";
  });

  document.addEventListener("mouseover", (event) => {
    const hoverTarget = event.target.closest(
      'a, button, [data-hover], input, select, textarea, label, .help-card, .service-card'
    );
    document.body.classList.toggle("cursor-hover", Boolean(hoverTarget));
  });

  document.addEventListener("mouseout", (event) => {
    if (!event.relatedTarget) {
      document.body.classList.remove("cursor-hover");
    }
  });

  const animateRing = () => {
    ringX = lerp(ringX, mouseX, 0.14);
    ringY = lerp(ringY, mouseY, 0.14);

    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;

    requestAnimationFrame(animateRing);
  };

  animateRing();
}

// ======================================================
// MOBILE MENU
// ======================================================
function initMobileMenu({ prefersReducedMotion }) {
  const menuToggle = $("#menuToggle");
  const mobileMenuOverlay = $("#mobileMenuOverlay");
  const closeMenu = $("#closeMenu");
  const mobileLinks = $$(".mobile-nav-link");

  if (!menuToggle || !mobileMenuOverlay) return;

  const openMenu = () => {
    mobileMenuOverlay.classList.add("active");
    menuToggle.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";

    if (!prefersReducedMotion) {
      const firstLink = mobileLinks[0];
      if (firstLink) firstLink.focus();
    }
  };

  const closeMobileMenu = () => {
    mobileMenuOverlay.classList.remove("active");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenuOverlay.classList.contains("active");
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMenu();
    }
  });

  if (closeMenu) {
    closeMenu.addEventListener("click", closeMobileMenu);
  }

  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  mobileMenuOverlay.addEventListener("click", (event) => {
    if (event.target === mobileMenuOverlay) {
      closeMobileMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileMenuOverlay.classList.contains("active")) {
      closeMobileMenu();
    }
  });
}

// ======================================================
// HEADER SCROLL EFFECT
// ======================================================
function initHeaderScroll() {
  const header = $(".header");
  if (!header) return;

  const updateHeader = () => {
    if (header.classList.contains("header-alt")) return;
    header.classList.toggle("scrolled", window.scrollY > 60);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

// ======================================================
// HERO CANVAS WEB
// ======================================================
function initHeroCanvas({ prefersReducedMotion }) {
  const canvas = $("#heroCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let lines = [];
  let time = 0;
  let animationId = null;

  const mouse = {
    x: -1000,
    y: -1000,
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = rect.width;
    height = rect.height;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    buildWeb();
    drawFrame();
  };

  const buildWeb = () => {
    lines = [];

    const centerX = width * 0.73;
    const centerY = height * 0.44;
    const rings = 9;
    const spokes = 18;
    const maxRadius = Math.min(width, height) * 0.46;

    for (let spoke = 0; spoke < spokes; spoke += 1) {
      const angle = (spoke / spokes) * Math.PI * 2;

      lines.push({
        type: "spoke",
        x1: centerX,
        y1: centerY,
        x2: centerX + Math.cos(angle) * maxRadius,
        y2: centerY + Math.sin(angle) * maxRadius,
        phase: spoke * 0.3,
      });
    }

    for (let ring = 1; ring <= rings; ring += 1) {
      const radius = (ring / rings) * maxRadius;

      for (let spoke = 0; spoke < spokes; spoke += 1) {
        const angle1 = (spoke / spokes) * Math.PI * 2;
        const angle2 = ((spoke + 1) / spokes) * Math.PI * 2;

        lines.push({
          type: "ring",
          x1: centerX + Math.cos(angle1) * radius,
          y1: centerY + Math.sin(angle1) * radius,
          x2: centerX + Math.cos(angle2) * radius,
          y2: centerY + Math.sin(angle2) * radius,
          phase: ring * 0.45 + spoke * 0.12,
          ring,
        });
      }
    }
  };

  const drawFrame = () => {
    ctx.clearRect(0, 0, width, height);

    if (!prefersReducedMotion) {
      time += 0.008;
    }

    lines.forEach((line) => {
      const midX = (line.x1 + line.x2) / 2;
      const midY = (line.y1 + line.y2) / 2;
      const deltaX = mouse.x - midX;
      const deltaY = mouse.y - midY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const distanceFactor = clamp(1 - distance / 180, 0, 1);

      const sway = prefersReducedMotion ? 0 : Math.sin(time + line.phase) * 0.7;
      const alpha =
        line.type === "spoke"
          ? 0.08 + (prefersReducedMotion ? 0 : Math.sin(time * 0.4 + line.phase) * 0.02)
          : 0.04 +
            (line.ring / 9) * 0.04 +
            (prefersReducedMotion ? 0 : Math.sin(time * 0.5 + line.phase) * 0.015);

      ctx.beginPath();
      ctx.moveTo(line.x1 + sway * 0.5, line.y1 + sway * 0.5);

      if (line.type === "ring") {
        const controlX = midX + (mouse.x - midX) * distanceFactor * 0.15 + sway;
        const controlY = midY + (mouse.y - midY) * distanceFactor * 0.15 + sway * 0.5;
        ctx.quadraticCurveTo(controlX, controlY, line.x2 + sway * 0.3, line.y2 + sway * 0.3);
      } else {
        ctx.lineTo(line.x2, line.y2);
      }

      const gradient = ctx.createLinearGradient(line.x1, line.y1, line.x2, line.y2);
      gradient.addColorStop(0, `rgba(245, 239, 231, ${alpha * (1 + distanceFactor * 0.7)})`);
      gradient.addColorStop(0.5, `rgba(201, 168, 99, ${alpha * 0.18 + distanceFactor * 0.10})`);
      gradient.addColorStop(1, `rgba(245, 239, 231, ${alpha * (1 + distanceFactor * 0.7)})`);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = line.type === "spoke" ? 0.65 : 0.5;
      ctx.stroke();
    });

    if (!prefersReducedMotion) {
      animationId = requestAnimationFrame(drawFrame);
    }
  };

  window.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  });

  window.addEventListener(
    "resize",
    debounce(() => {
      resize();
    }, 120)
  );

  resize();

  if (!prefersReducedMotion) {
    drawFrame();
  }

  window.addEventListener("beforeunload", () => {
    if (animationId) cancelAnimationFrame(animationId);
  });
}

// ======================================================
// SPIDER WEB NAVIGATION
// ======================================================
function initWebNavigation({ prefersReducedMotion }) {
  const nav = $(".web-nav");
  const spider = $("#webSpider");
  const nodes = $$(".web-node");

  if (!nav || !spider || !nodes.length) return;

  const items = nodes
    .map((node) => {
      const targetSelector = node.getAttribute("data-target");
      const element = targetSelector ? $(targetSelector) : null;
      return element ? { node, element } : null;
    })
    .filter(Boolean);

  if (!items.length) return;

  let activeIndex = 0;
  let spiderY = 0;

  const spiderInner = $(".spider-svg", spider);

  const layoutNodes = () => {
    const height = nav.clientHeight;
    const padding = 16;
    const usableHeight = Math.max(height - padding * 2, 1);

    items.forEach((item, index) => {
      const ratio = items.length === 1 ? 0.5 : index / (items.length - 1);
      item.node.style.top = `${padding + usableHeight * ratio}px`;
    });

    moveSpiderTo(activeIndex, true);
  };

  const moveSpiderTo = (index, immediate = false) => {
    const targetNode = items[index]?.node;
    if (!targetNode) return;

    const targetY = targetNode.offsetTop;

    if (immediate || prefersReducedMotion) {
      spiderY = targetY;
    } else {
      spiderY = lerp(spiderY, targetY, 0.12);
    }

    spider.style.transform = `translate(-50%, ${spiderY}px)`;

    if (spiderInner && !prefersReducedMotion) {
      const sway = Math.sin(Date.now() * 0.002) * 2.5;
      spiderInner.style.transform = `translateX(${sway}px)`;
    }
  };

  const setActive = (index) => {
    activeIndex = index;
    items.forEach((item, itemIndex) => {
      item.node.classList.toggle("is-active", itemIndex === index);
    });
  };

  items.forEach((item, index) => {
    item.node.addEventListener("click", (event) => {
      event.preventDefault();

      item.element.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });

      setActive(index);
    });
  });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleEntry) return;

      const index = items.findIndex((item) => item.element === visibleEntry.target);
      if (index !== -1) {
        setActive(index);
      }
    },
    {
      threshold: [0.2, 0.45, 0.7],
    }
  );

  items.forEach((item) => sectionObserver.observe(item.element));

  layoutNodes();
  setActive(0);

  window.addEventListener("resize", debounce(layoutNodes, 120));

  if (!prefersReducedMotion) {
    const tick = () => {
      moveSpiderTo(activeIndex);
      requestAnimationFrame(tick);
    };
    tick();
  } else {
    moveSpiderTo(0, true);
  }
}

// ======================================================
// SCROLL ANIMATIONS
// ======================================================
function initScrollAnimations({ prefersReducedMotion }) {
  const animatedElements = $$("[data-animation]");
  const processCards = $$(".process-card");

  if (prefersReducedMotion) {
    animatedElements.forEach((element) => element.classList.add("animated"));
    processCards.forEach((card) => card.classList.add("animated"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  animatedElements.forEach((element) => observer.observe(element));
  processCards.forEach((card) => observer.observe(card));
}

// ======================================================
// HERO PARALLAX
// ======================================================
function initHeroParallax({ prefersReducedMotion }) {
  const heroGradient = $(".hero-bg-gradient");
  if (!heroGradient || prefersReducedMotion) return;

  const updateParallax = () => {
    const offset = Math.min(window.scrollY * 0.16, 120);
    heroGradient.style.transform = `translateY(${offset}px)`;
  };

  updateParallax();
  window.addEventListener("scroll", updateParallax, { passive: true });
}

// ======================================================
// HELP ME CHOOSE
// ======================================================
function initHelpChooser({ prefersReducedMotion }) {
  const cards = $$(".help-card");
  const result = $("#helpResult");
  const title = $("#helpResultTitle");
  const text = $("#helpResultText");
  const quoteButton = $("#helpQuoteBtn");

  if (!cards.length || !result || !title || !text) return;

  const setSelected = (activeCard) => {
    cards.forEach((card) => card.classList.remove("is-selected"));
    activeCard.classList.add("is-selected");
  };

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const pest =
        card.getAttribute("data-pest") ||
        $(".help-name", card)?.textContent?.trim() ||
        "Pest";

      const message =
        card.getAttribute("data-msg") ||
        "Tell us what’s happening and we’ll recommend the best treatment.";

      setSelected(card);

      title.innerHTML = `Recommended next step: <span class="help-highlight">${pest}</span>`;
      text.textContent = message;

      if (quoteButton) {
        quoteButton.href = `contact.html?pest=${encodeURIComponent(pest)}`;
      }

      result.hidden = false;

      result.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "center",
      });
    });
  });
}

// ======================================================
// CONTACT PREFILL FROM QUERY STRING
// ======================================================
function initContactPrefill() {
  const params = new URLSearchParams(window.location.search);
  const pest = params.get("pest");
  const pestSelect = $("#pest");

  if (!pest || !pestSelect) return;

  const pestMap = {
    cockroaches: "cockroaches",
    "german cockroaches": "cockroaches",
    spiders: "spiders",
    rodents: "rodents",
    "rats & mice": "rodents",
    rats: "rodents",
    mice: "rodents",
    ants: "ants",
    "bed bugs": "bed-bugs",
    fleas: "fleas",
    wasps: "bees-wasps",
    bees: "bees-wasps",
    "bees & wasps": "bees-wasps",
    termites: "termites",
    "termites (pre-construction)": "termites",
    other: "other",
  };

  const normalized = pest.trim().toLowerCase();
  const mappedValue = pestMap[normalized];

  if (mappedValue) {
    pestSelect.value = mappedValue;
    return;
  }

  const matchedOption = Array.from(pestSelect.options).find((option) => {
    const optionValue = option.value.trim().toLowerCase();
    const optionText = option.textContent.trim().toLowerCase();
    return optionValue === normalized || optionText === normalized;
  });

  if (matchedOption) {
    pestSelect.value = matchedOption.value;
  }
}

// ======================================================
// SERVICE CARD TILT
// ======================================================
function initServiceCardTilt({ prefersReducedMotion, hasFinePointer }) {
  if (prefersReducedMotion || !hasFinePointer) return;

  $$(".service-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      card.style.transform = `
        translateY(-4px)
        perspective(700px)
        rotateX(${-y * 6}deg)
        rotateY(${x * 6}deg)
      `;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

// ======================================================
// FAQ ACCORDION
// ======================================================
function initFAQ() {
  $$(".faq-item").forEach((item) => {
    const question = $(".faq-question", item);
    if (!question) return;

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      $$(".faq-item").forEach((faqItem) => faqItem.classList.remove("active"));

      if (!isActive) {
        item.classList.add("active");
      }
    });
  });
}

// ======================================================
// CONTACT FORM
// ======================================================
function initContactForm() {
  const contactForm = $("#contactForm");
  if (!contactForm) return;

  const submitButton = $(".form-submit", contactForm);
  let isSubmitting = false;

  contactForm.addEventListener("submit", (event) => {
    if (isSubmitting) {
      event.preventDefault();
      return;
    }

    if (!contactForm.checkValidity()) return;

    const honey = contactForm.querySelector('input[name="_honey"]');
    if (honey && honey.value.trim().length) {
      event.preventDefault();
      return;
    }

    const email = $("#email", contactForm)?.value?.trim();
    const replyTo = contactForm.querySelector('input[name="_replyto"]');

    if (replyTo && email) {
      replyTo.value = email;
    }

    isSubmitting = true;

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
      submitButton.textContent = "Sending...";
    }
  });
}

// ======================================================
// REVIEW FORM
// ======================================================
function initReviewForm() {
  const reviewForm = $("#reviewForm");
  if (!reviewForm) return;

  const reviewSubmit = $('button[type="submit"]', reviewForm);
  let isSubmitting = false;

  reviewForm.addEventListener("submit", (event) => {
    if (isSubmitting) {
      event.preventDefault();
      return;
    }

    if (!reviewForm.checkValidity()) return;

    const honey = reviewForm.querySelector('input[name="_honey"]');
    if (honey && honey.value.trim().length) {
      event.preventDefault();
      return;
    }

    const reviewEmail = $("#reviewEmail", reviewForm)?.value?.trim();
    const replyTo = reviewForm.querySelector('input[name="_replyto"]');

    if (replyTo && reviewEmail) {
      replyTo.value = reviewEmail;
    }

    isSubmitting = true;

    if (reviewSubmit) {
      reviewSubmit.disabled = true;
      reviewSubmit.setAttribute("aria-busy", "true");
      reviewSubmit.textContent = "Submitting...";
    }
  });
}

// ======================================================
// REQUIRED FIELD VALIDATION
// ======================================================
function initFieldValidation() {
  $$("input[required], select[required], textarea[required]").forEach((field) => {
    field.addEventListener("invalid", (event) => {
      event.preventDefault();
      field.classList.add("error");
    });

    field.addEventListener("input", () => {
      field.classList.remove("error");
    });

    field.addEventListener("change", () => {
      field.classList.remove("error");
    });
  });
}

// ======================================================
// STAGGERED DELAYS
// ======================================================
function initStaggerDelays() {
  const applyStagger = (selector, delay) => {
    $$(selector).forEach((element, index) => {
      element.style.transitionDelay = `${index * delay}ms`;
    });
  };

  applyStagger(".service-card", 80);
  applyStagger(".process-card", 140);
  applyStagger(".approach-card", 80);
  applyStagger(".service-detail-card", 80);
  applyStagger(".why-list li", 70);
  applyStagger(".credentials-list li", 70);
  applyStagger(".about-stat-card", 100);
  applyStagger(".additional-card", 80);
}

// ======================================================
// SMOOTH ANCHOR LINKS
// ======================================================
function initSmoothAnchors({ prefersReducedMotion }) {
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = $(href);
      if (!target) return;

      event.preventDefault();

      const header = $(".header");
      const offset = header ? header.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top: targetTop,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  });
}

// ======================================================
// LAZY LOAD IMAGES
// ======================================================
function initLazyImages() {
  if (!("IntersectionObserver" in window)) return;

  const lazyImages = $$("img[data-src]");
  if (!lazyImages.length) return;

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const image = entry.target;
      const source = image.getAttribute("data-src");

      if (source) {
        image.src = source;
        image.classList.add("loaded");
      }

      observer.unobserve(image);
    });
  });

  lazyImages.forEach((image) => imageObserver.observe(image));
}

// ======================================================
// PHONE TRACKING
// ======================================================
function initPhoneTracking() {
  $$('a[href^="tel:"]').forEach((link) => {
    link.addEventListener("click", () => {
      console.log("Phone call initiated:", link.getAttribute("href"));
    });
  });
}

// ======================================================
// REVIEWS CAROUSEL
// ======================================================
function initReviewsCarousel() {
  const carousel = document.querySelector("[data-carousel]");
  if (!carousel) return;

  const track = carousel.querySelector("[data-track]");
  const dotsContainer = carousel.querySelector("[data-dots]");
  if (!track) return;

  const originalCards = Array.from(track.querySelectorAll(".review-card"));
  if (originalCards.length < 2) return;

  if (!track.dataset.looped) {
    originalCards.forEach((card) => {
      track.appendChild(card.cloneNode(true));
    });
    track.dataset.looped = "true";
  }

  track.style.scrollSnapType = "none";
  track.style.scrollBehavior = "auto";
  track.style.overflowX = "auto";

  let animationId = null;
  let paused = false;
  let position = 0;
  const speed = 1.2;

  const getLoopWidth = () => track.scrollWidth / 2;

  const buildDots = () => {
    if (!dotsContainer || dotsContainer.children.length) return;

    originalCards.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "rev-dot";
      dot.setAttribute("aria-label", `Go to review ${index + 1}`);

      dot.addEventListener("click", () => {
        const loopWidth = getLoopWidth();
        const step = loopWidth / originalCards.length;
        position = index * step;
        track.scrollLeft = position;
        updateDots();
      });

      dotsContainer.appendChild(dot);
    });
  };

  const updateDots = () => {
    if (!dotsContainer || !dotsContainer.children.length) return;

    const loopWidth = getLoopWidth();
    if (!loopWidth) return;

    const step = loopWidth / originalCards.length;
    if (!step) return;

    const normalized = ((position % loopWidth) + loopWidth) % loopWidth;
    const activeIndex = Math.round(normalized / step) % originalCards.length;

    Array.from(dotsContainer.children).forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
    });
  };

  const tick = () => {
    if (!paused) {
      const loopWidth = getLoopWidth();

      position += speed;

      if (loopWidth > 0 && position >= loopWidth) {
        position -= loopWidth;
      }

      track.scrollLeft = position;
      updateDots();
    }

    animationId = requestAnimationFrame(tick);
  };

  const stop = () => {
    if (animationId) cancelAnimationFrame(animationId);
    animationId = null;
  };

  buildDots();

  requestAnimationFrame(() => {
    position = track.scrollLeft || 0;
    updateDots();
    stop();
    animationId = requestAnimationFrame(tick);
  });

  window.addEventListener("load", () => {
    position = track.scrollLeft || 0;
    updateDots();
  });

  carousel.addEventListener("mouseenter", () => {
    paused = true;
  });

  carousel.addEventListener("mouseleave", () => {
    paused = false;
  });

  carousel.addEventListener("focusin", () => {
    paused = true;
  });

  carousel.addEventListener("focusout", () => {
    paused = false;
  });

  carousel.addEventListener(
    "touchstart",
    () => {
      paused = true;
    },
    { passive: true }
  );

  carousel.addEventListener(
    "touchend",
    () => {
      paused = false;
    },
    { passive: true }
  );

  window.addEventListener(
    "resize",
    debounce(() => {
      const loopWidth = getLoopWidth();
      if (loopWidth > 0 && position >= loopWidth) {
        position = position % loopWidth;
      }
      track.scrollLeft = position;
      updateDots();
    }, 150)
  );

  window.addEventListener("beforeunload", stop);
}

// ======================================================
// SUCCESS STATES FROM QUERY STRING
// ======================================================
function initQuerySuccessStates({ prefersReducedMotion }) {
  const params = new URLSearchParams(window.location.search);

  if (params.get("sent") === "1") {
    const contactForm = $("#contactForm");
    const formSuccess = $("#formSuccess");

    if (contactForm) {
      contactForm.style.display = "none";
    }

    if (formSuccess) {
      formSuccess.style.display = "block";

      formSuccess.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "center",
      });
    }
  }

  if (params.get("review") === "1") {
    const reviewSuccess = $("#reviewSuccess");

    if (reviewSuccess) {
      reviewSuccess.style.display = "block";

      reviewSuccess.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "center",
      });
    }
  }
}

// ======================================================
// CONSOLE BRANDING
// ======================================================
function initConsoleBrand() {
  console.log(
    "%cPestControlSYD",
    "font-size:20px;font-weight:700;color:#c9a863;letter-spacing:0.08em;"
  );
  console.log(
    "%cPremium customer-ready experience loaded.",
    "font-size:12px;color:#b8b0a6;"
  );
}
