// ============================================
// PESTCONTROLSYD — REMASTERED INTERACTIONS
// Spider + Canvas Web + 3D Scroll + All Original Logic
// ============================================

document.addEventListener('DOMContentLoaded', function () {

  // ============================================
  // CUSTOM CURSOR
  // ============================================
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');

  if (cursor && cursorRing) {
    let mx = -100, my = -100;
    let rx = -100, ry = -100;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    const lerpRing = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      requestAnimationFrame(lerpRing);
    };
    lerpRing();

    const hoverEls = document.querySelectorAll('a, button, [data-hover]');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // ============================================
  // MOBILE MENU
  // ============================================
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
  const closeMenu = document.getElementById('closeMenu');

  if (menuToggle && mobileMenuOverlay) {
    menuToggle.addEventListener('click', () => {
      mobileMenuOverlay.classList.add('active');
      menuToggle.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    const closeMobile = () => {
      mobileMenuOverlay.classList.remove('active');
      menuToggle.classList.remove('open');
      document.body.style.overflow = '';
    };

    if (closeMenu) closeMenu.addEventListener('click', closeMobile);

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', closeMobile);
    });

    mobileMenuOverlay.addEventListener('click', e => {
      if (e.target === mobileMenuOverlay) closeMobile();
    });
  }

  // ============================================
  // HEADER SCROLL EFFECT
  // ============================================
  const header = document.querySelector('.header');
  if (header && !header.classList.contains('header-alt')) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 80);
    });
  }

  // ============================================
  // CANVAS SPIDER WEB HERO
  // ============================================
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, mouse = { x: -1000, y: -1000 };
    let lines = [], time = 0;

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      buildWeb();
    };

    const buildWeb = () => {
      lines = [];
      const cx = W * 0.72, cy = H * 0.44;
      const rings = 9, spokes = 18;
      const maxR = Math.min(W, H) * 0.48;

      // Spokes
      for (let s = 0; s < spokes; s++) {
        const angle = (s / spokes) * Math.PI * 2;
        lines.push({
          type: 'spoke',
          x1: cx, y1: cy,
          x2: cx + Math.cos(angle) * maxR,
          y2: cy + Math.sin(angle) * maxR,
          phase: s * 0.3
        });
      }

      // Ring strands (catenary-ish)
      for (let r = 1; r <= rings; r++) {
        const rad = (r / rings) * maxR;
        for (let s = 0; s < spokes; s++) {
          const a1 = (s / spokes) * Math.PI * 2;
          const a2 = ((s + 1) / spokes) * Math.PI * 2;
          lines.push({
            type: 'ring',
            x1: cx + Math.cos(a1) * rad,
            y1: cy + Math.sin(a1) * rad,
            x2: cx + Math.cos(a2) * rad,
            y2: cy + Math.sin(a2) * rad,
            phase: r * 0.5 + s * 0.1,
            ring: r
          });
        }
      }
    };

    const drawWeb = () => {
      ctx.clearRect(0, 0, W, H);
      time += 0.008;

      lines.forEach(l => {
        const mx = (l.x1 + l.x2) / 2;
        const my = (l.y1 + l.y2) / 2;
        const dx = mouse.x - mx;
        const dy = mouse.y - my;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const maxDist = 180;
        const distFactor = Math.max(0, 1 - dist / maxDist);
        const sway = Math.sin(time + l.phase) * 0.7;
        const warp = distFactor * 12;

        const alpha = l.type === 'spoke'
          ? 0.08 + Math.sin(time * 0.4 + l.phase) * 0.02
          : (0.04 + (l.ring / 9) * 0.04 + Math.sin(time * 0.5 + l.phase) * 0.015);

        ctx.beginPath();
        ctx.moveTo(l.x1 + sway * 0.5, l.y1 + sway * 0.5);

        if (l.type === 'ring') {
          const cpx = mx + (mouse.x - mx) * distFactor * 0.15 + sway;
          const cpy = my + (mouse.y - my) * distFactor * 0.15 + sway * 0.5;
          ctx.quadraticCurveTo(cpx, cpy, l.x2 + sway * 0.3, l.y2 + sway * 0.3);
        } else {
          ctx.lineTo(l.x2, l.y2);
        }

        const grad = ctx.createLinearGradient(l.x1, l.y1, l.x2, l.y2);
        grad.addColorStop(0, `rgba(240,232,210,${alpha * (1 + distFactor * 0.8)})`);
        grad.addColorStop(0.5, `rgba(196,30,58,${alpha * 0.4 + distFactor * 0.12})`);
        grad.addColorStop(1, `rgba(240,232,210,${alpha * (1 + distFactor * 0.8)})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = l.type === 'spoke' ? 0.6 : 0.5;
        ctx.stroke();
      });

      requestAnimationFrame(drawWeb);
    };

    window.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('resize', resize);
    resize();
    drawWeb();
  }

  // ============================================
  // SPIDER WEB NAVIGATION
  // ============================================
  const nav = document.querySelector('.web-nav');
  const spider = document.getElementById('webSpider');
  const nodes = Array.from(document.querySelectorAll('.web-node'));

  if (nav && spider && nodes.length > 0) {
    const items = nodes
      .map(node => {
        const sel = node.getAttribute('data-target');
        const el = sel ? document.querySelector(sel) : null;
        return el ? { node, el } : null;
      })
      .filter(Boolean);

    if (items.length > 0) {
      // Smooth scroll on click
      items.forEach(({ node, el }) => {
        node.addEventListener('click', e => {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });

      // Layout nodes
      const layoutNodes = () => {
        const h = nav.clientHeight;
        const pad = 16;
        const usable = Math.max(1, h - pad * 2);
        items.forEach(({ node }, i) => {
          const t = items.length === 1 ? 0.5 : i / (items.length - 1);
          node.style.top = pad + usable * t + 'px';
        });
      };

      // Active section tracking
      let activeIndex = 0;
      const setActive = idx => {
        activeIndex = idx;
        items.forEach((it, i) => it.node.classList.toggle('is-active', i === idx));
      };

      const io = new IntersectionObserver(entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const idx = items.findIndex(it => it.el === visible.target);
        if (idx !== -1 && idx !== activeIndex) setActive(idx);
      }, { threshold: [0.25, 0.5, 0.75] });

      items.forEach(({ el }) => io.observe(el));

      // Spider lerp motion
      let currentY = 0;
      const spiderMax = () => Math.max(0, nav.clientHeight - 40);
      const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

      const tick = () => {
        const doc = document.documentElement;
        const scrollTop = window.scrollY || doc.scrollTop;
        const scrollMax = Math.max(1, doc.scrollHeight - window.innerHeight);
        const p = clamp(scrollTop / scrollMax, 0, 1);
        const targetY = p * spiderMax();
        currentY += (targetY - currentY) * 0.12;

        const sway = Math.sin(Date.now() * 0.001) * 4;

        // Move the container (always) for Y tracking
        spider.style.transform = `translateX(-50%) translateY(${currentY}px) rotate(180deg)`;
        
        // Sway ONLY the inner element so we never overwrite container transform
        const spiderInner =
          spider.querySelector('.spider-svg') ||
          spider.querySelector('.spider-body') ||
          spider.querySelector('.spider-glow');
        
        if (spiderInner) spiderInner.style.transform = `translateX(${sway}px)`;
        requestAnimationFrame(tick);
      };

      layoutNodes();
      window.addEventListener('resize', layoutNodes);
      setActive(0);
      requestAnimationFrame(tick);
    }
  }

  // ============================================
  // SCROLL ANIMATIONS (3D)
  // ============================================
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, { rootMargin: '0px', threshold: 0.1 });

  document.querySelectorAll('[data-animation]').forEach(el => observer.observe(el));

  // Process card side-line reveal
  const processObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('animated');
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.process-card').forEach(el => processObs.observe(el));

  // ============================================
  // PARALLAX HERO
  // ============================================
  const heroBg = document.querySelector('.hero-background');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight * 1.5) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    }, { passive: true });
  }
// ============================================
// HELP ME CHOOSE (Index only) — fixed + customer-focused
// Adds: selected state, keeps highlight span, supports name labels
// ============================================
(() => {
  const cards  = document.querySelectorAll('.help-card');
  const result = document.getElementById('helpResult');
  const title  = document.getElementById('helpResultTitle');
  const text   = document.getElementById('helpResultText');
  const quote  = document.getElementById('helpQuoteBtn');

  if (!cards.length || !result || !title || !text) return;

  const setSelected = (activeCard) => {
    cards.forEach(c => c.classList.remove('is-selected'));
    activeCard.classList.add('is-selected');
  };

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const pest =
        card.getAttribute('data-pest') ||
        card.querySelector('.help-name')?.textContent?.trim() ||
        card.querySelector('.help-title')?.textContent?.trim() ||
        'Pest';

      const msg =
        card.getAttribute('data-msg') ||
        'Tell us what’s happening and we’ll recommend the best treatment.';

      setSelected(card);

      title.innerHTML = `Recommended next step: <span class="help-highlight">${pest}</span>`;
      text.textContent = msg;

      if (quote) quote.href = `contact.html?pest=${encodeURIComponent(pest)}`;

      result.hidden = false;
      result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
})();
// ============================================
// CONTACT PREFILL (pest from query string)
// ============================================
(() => {
  const params = new URLSearchParams(window.location.search);
  const pest = params.get('pest');
  const pestSelect = document.getElementById('pest');

  if (!pest || !pestSelect) return;

  // Try exact match first
  let opt = Array.from(pestSelect.options).find(o => o.value === pest);

  // Fallback: case-insensitive match by value OR visible text
  if (!opt) {
    const p = pest.trim().toLowerCase();
    opt = Array.from(pestSelect.options).find(o =>
      (o.value || "").trim().toLowerCase() === p ||
      (o.textContent || "").trim().toLowerCase() === p
    );
  }

  if (opt) pestSelect.value = opt.value;
})();
  // ============================================
  // SERVICE CARD 3D MOUSE TILT
  // ============================================
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `
        translateY(-4px)
        perspective(600px)
        rotateX(${-y * 6}deg)
        rotateY(${x * 6}deg)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ============================================
  // FAQ ACCORDION
  // ============================================
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    }
  });

// ============================================
// CONTACT FORM (FormSubmit) — reliable + professional
// ============================================
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  let isSubmitting = false;

  contactForm.addEventListener('submit', function (e) {
    // Stop double clicks
    if (isSubmitting) {
      e.preventDefault();
      return;
    }

    // If HTML validation fails, let the browser show it (don’t submit)
    if (!contactForm.checkValidity()) {
      return;
    }

    isSubmitting = true;

    // ✅ Set Reply-To so the email you receive can be replied to directly
    const email = document.getElementById('email')?.value?.trim();
    const replyTo = contactForm.querySelector('input[name="_replyto"]');
    if (replyTo && email) replyTo.value = email;

    // ✅ Optional: spam honeypot (only if you add the hidden input)
    const honey = contactForm.querySelector('input[name="_honey"]');
    if (honey && honey.value.trim().length) {
      e.preventDefault();
      return;
    }

    // ✅ Show success UI immediately (but still allow normal submit)
    contactForm.style.display = 'none';
    if (formSuccess) {
      formSuccess.style.display = 'block';
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // ✅ IMPORTANT: do NOT preventDefault and do NOT call contactForm.submit()
    // Let FormSubmit handle sending the email normally.
  });
}

  // ============================================
  // REQUIRED FIELD VALIDATION STYLE
  // ============================================
  document.querySelectorAll('input[required], select[required], textarea[required]').forEach(input => {
    input.addEventListener('invalid', e => {
      e.preventDefault();
      input.classList.add('error');
    });
    input.addEventListener('input', () => input.classList.remove('error'));
  });

  // ============================================
  // STAGGERED ANIMATION DELAYS
  // ============================================
  const stagger = (sel, delay) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.style.transitionDelay = `${i * delay}ms`;
    });
  };

  stagger('.service-card', 80);
  stagger('.process-card', 150);
  stagger('.approach-card', 80);
  stagger('.service-detail-card', 80);
  stagger('.why-list li', 70);
  stagger('.credentials-list li', 70);
  stagger('.about-stat-card', 100);
  stagger('.additional-card', 80);

  // ============================================
  // SMOOTH ANCHOR SCROLLING
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && href !== '#') {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = header ? header.offsetHeight : 0;
          window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        }
      }
    });
  });

  // ============================================
  // LAZY LOAD IMAGES
  // ============================================
  if ('IntersectionObserver' in window) {
    const imgObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
            imgObs.unobserve(img);
          }
        }
      });
    });
    document.querySelectorAll('img[data-src]').forEach(img => imgObs.observe(img));
  }

  // ============================================
  // PHONE TRACKING
  // ============================================
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
      console.log('Phone call initiated:', link.href);
    });
  });
// ============================================
// REVIEWS CAROUSEL — FORCED AUTOSCROLL + DEBUG
// ============================================
(() => {
  const carousel = document.querySelector('[data-carousel]');
  if (!carousel) { console.log("❌ No [data-carousel] found"); return; }

  const track = carousel.querySelector('[data-track]');
  if (!track) { console.log("❌ No [data-track] found"); return; }

  const originals = Array.from(track.children).filter(el => el.classList.contains('review-card'));
  console.log("✅ Reviews found:", originals.length);

  if (originals.length < 2) { console.log("❌ Need at least 2 review cards"); return; }

  // Clone for loop (once)
  if (!track.dataset.looped) {
    originals.forEach(card => track.appendChild(card.cloneNode(true)));
    track.dataset.looped = "true";
    console.log("✅ Cloned reviews for looping");
  }

  // HARD force styles (even if CSS is wrong)
  track.style.scrollSnapType = "none";
  track.style.scrollBehavior = "auto";

  let speed = 2;       // try 0.35–0.8
  const slow = 0.2;

  const loopPoint = () => track.scrollWidth / 2;

  let frames = 0;

  const tick = () => {
    // Force movement even if sizes aren't ready yet
    track.scrollLeft += speed;

    const lp = loopPoint();
    if (lp > 0 && track.scrollLeft >= lp) track.scrollLeft -= lp;

    // Debug every ~2 seconds
    frames++;
    if (frames % 120 === 0) {
      console.log("▶️ autoplay running | scrollLeft:", Math.round(track.scrollLeft), "| scrollWidth:", Math.round(track.scrollWidth), "| clientWidth:", Math.round(track.clientWidth));
    }

    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);

  console.log("✅ Reviews autoplay STARTED");
})();
  // ============================================
  // CONSOLE BRAND
  // ============================================
  console.log('%c🕷️ PestControlSYD', 'font-size:20px;font-weight:bold;color:#C41E3A;');
  console.log('%cRemastered. Dark. Dangerous.', 'font-size:13px;color:#888;');
});

// ============================================
// REVIEW FORM UX (FormSubmit) — email to business
// ============================================
(() => {
  const form = document.getElementById('reviewForm');
  const success = document.getElementById('reviewSuccess');
  if (!form) return;

  let isSubmitting = false;

  form.addEventListener('submit', (e) => {
    if (isSubmitting) { e.preventDefault(); return; }
    if (!form.checkValidity()) return;

    // honeypot spam check
    const honey = form.querySelector('input[name="_honey"]');
    if (honey && honey.value.trim().length) {
      e.preventDefault();
      return;
    }

    // set reply-to if email provided
    const reviewEmail = document.getElementById('reviewEmail')?.value?.trim();
    const replyTo = form.querySelector('input[name="_replyto"]');
    if (replyTo && reviewEmail) replyTo.value = reviewEmail;

    isSubmitting = true;

    // show success UI instantly (still submits normally)
    if (success) {
      success.style.display = 'block';
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
})();

// ============================================
// DEBOUNCE UTILITY
// ============================================
function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

window.addEventListener('resize', debounce(() => {}, 250));
