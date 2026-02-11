(() => {
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  
    // Mobile menu
    const menuBtn = document.querySelector("[data-menu-button]");
    const drawer = document.querySelector("[data-drawer]");
    const closeBtns = document.querySelectorAll("[data-close]");
    const drawerLinks = document.querySelectorAll("[data-drawer-link]");
    const header = document.querySelector("[data-header]");
    const nav = document.querySelector("[data-nav]");
  
    function openDrawer() {
        // ✅ Only allow drawer on mobile
        if (window.matchMedia("(max-width: 860px)").matches !== true) return;
      
        drawer?.classList.add("is-open");
        drawer?.setAttribute("aria-hidden", "false");
        menuBtn?.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
      }
      
  
    function closeDrawer() {
      drawer?.classList.remove("is-open");
      drawer?.setAttribute("aria-hidden", "true");
      menuBtn?.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  
    menuBtn?.addEventListener("click", openDrawer);
    closeBtns.forEach(btn => btn.addEventListener("click", closeDrawer));
    drawerLinks.forEach(a => a.addEventListener("click", closeDrawer));
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDrawer();
    });
  
    // FAQ accordion
    const faq = document.querySelector("[data-faq]");
    if (faq) {
      faq.querySelectorAll(".faq__q").forEach((btn) => {
        btn.addEventListener("click", () => {
          const expanded = btn.getAttribute("aria-expanded") === "true";
          // close others for cleaner UX
          faq.querySelectorAll(".faq__q").forEach(b => {
            b.setAttribute("aria-expanded", "false");
            const ans = b.nextElementSibling;
            if (ans) ans.hidden = true;
          });
          // toggle this one
          btn.setAttribute("aria-expanded", String(!expanded));
          const answer = btn.nextElementSibling;
          if (answer) answer.hidden = expanded;
        });
      });
    }
  
    // Demo form handlers (replace with real submission later)
    function handleForm(formId, noteId) {
      const form = document.getElementById(formId);
      const note = document.getElementById(noteId);
      if (!form || !note) return;
  
      form.addEventListener("submit", (e) => {
        e.preventDefault();
  
        // Basic validation
        const fd = new FormData(form);
        const name = (fd.get("name") || "").toString().trim();
        const phone = (fd.get("phone") || "").toString().trim();
        if (!name || !phone) {
          note.textContent = "Please enter your name and phone number.";
          note.style.color = "#c1121f";
          return;
        }
  
        note.textContent = "Thanks — we’ve received your request. We’ll be in touch shortly.";
        note.style.color = "#0b6b2a";
        form.reset();
      });
    }
  
    handleForm("quoteForm", "formNote");
    handleForm("contactForm", "contactNote");
  })();
  // --- HiPages + Pest Modal ---

// 1) HiPages badge (fill these in once you have them)
const HIPAGES = {
    url: "PASTE_YOUR_HIPAGES_PROFILE_LINK_HERE",
    rating: "5.0",
    count: "XX"
  };
  
  const hipagesLink = document.getElementById("hipagesLink");
  const hipagesRating = document.getElementById("hipagesRating");
  const hipagesCount = document.getElementById("hipagesCount");
  
  if (hipagesLink) hipagesLink.href = HIPAGES.url;
  if (hipagesRating) hipagesRating.textContent = HIPAGES.rating;
  if (hipagesCount) hipagesCount.textContent = HIPAGES.count;
  
  // 2) Pest modal content
  const pestInfo = {
    "Cockroaches": {
      desc: "We identify the species, target harbourage areas (kitchen/bathroom voids), and reduce re-infestation with prevention advice.",
      bullets: [
        ["Inspection", "Identify hotspots, nesting areas, moisture + food sources."],
        ["Treatment", "Targeted gel/dust/spray based on environment + safety."],
        ["Expected result", "Noticeable reduction quickly; follow-up steps prevent return."],
        ["Preparation", "Clear benches, empty under-sink areas if possible."]
      ]
    },
    "German Cockroaches": {
      desc: "German cockroaches require a more detailed approach (they breed fast). We focus on precision treatment and follow-up guidance.",
      bullets: [
        ["Inspection", "Confirm German activity (kitchen motors/hinges/voids)."],
        ["Treatment", "High-precision baiting + crack/crevice strategy."],
        ["Expected result", "Rapid drop in activity; best results with hygiene + sealing."],
        ["Follow-up", "We advise on monitoring and prevention to stop rebound."]
      ]
    },
    "Rats & Mice": {
      desc: "Inspection-led rodent control: entry points, harbourage, safe baiting strategy, and proofing guidance.",
      bullets: [
        ["Inspection", "Find access points, droppings runs, roof/subfloor risks."],
        ["Control", "Safe baiting/trapping strategy suited to property layout."],
        ["Prevention", "Proofing guidance to stop re-entry (gaps/vents/doors)."],
        ["Expected result", "Activity drops as access is blocked + control works."]
      ]
    },
    "Spiders": {
      desc: "We reduce spider activity by treating entry points, eaves, and web zones, and addressing the insects that attract them.",
      bullets: [
        ["Inspection", "Identify common web zones + entry points."],
        ["Treatment", "External perimeter + targeted areas (eaves/windows)."],
        ["Expected result", "Less webbing/activity; prevention reduces recurrence."],
        ["Advice", "Lighting + clutter tips that reduce prey insects."]
      ]
    },
    "Ants": {
      desc: "We identify ant type and trail sources, then apply targeted treatment to disrupt colonies and prevent repeat trails.",
      bullets: [
        ["Inspection", "Track trails, identify nest/food sources."],
        ["Treatment", "Targeted baiting where suitable + perimeter strategy."],
        ["Expected result", "Trail disruption; long-term improvement with prevention."],
        ["Advice", "Food storage + sealing tips to reduce attraction."]
      ]
    },
    "Bed Bugs": {
      desc: "We assess severity, advise preparation, and treat in a way that supports thorough control and reduces spread risk.",
      bullets: [
        ["Inspection", "Confirm signs, harbourage areas, room risk level."],
        ["Treatment", "Targeted approach suited to environment + safety."],
        ["Preparation", "Linen handling + room prep to improve results."],
        ["Expected result", "Requires diligence; we guide next steps clearly."]
      ]
    },
    "Bees & Wasps": {
      desc: "We assess nest location and risk, then remove/control safely with minimal disruption.",
      bullets: [
        ["Assessment", "Identify nest location + safe access approach."],
        ["Control", "Safe treatment/removal strategy."],
        ["Safety", "Advice to keep occupants safe during service."],
        ["Prevention", "Steps to reduce repeat nesting in common zones."]
      ]
    },
    "Fleas": {
      desc: "We treat affected areas and advise vacuuming + pet management steps to break the flea lifecycle.",
      bullets: [
        ["Inspection", "Hotspot rooms, carpets, pet zones."],
        ["Treatment", "Targeted internal treatment where needed."],
        ["Expected result", "Lifecycle breaks with correct follow-up routine."],
        ["Advice", "Vacuuming + pet treatment coordination tips."]
      ]
    }
  };
  
  // Modal elements
  const modal = document.getElementById("pestModal");
  const modalBackdrop = modal?.querySelector(".modal__backdrop");
  const modalClose = document.getElementById("pestClose");
  const pestTitle = document.getElementById("pestTitle");
  const pestDesc = document.getElementById("pestDesc");
  const pestBullets = document.getElementById("pestBullets");
  
  function openModalForPest(label) {
    const data = pestInfo[label] || {
      desc: "We’ll assess the situation and recommend the safest, most effective approach for your property.",
      bullets: [
        ["Inspection", "Identify the pest, cause, and risk level."],
        ["Treatment", "Targeted control suited to the environment."],
        ["Prevention", "Advice to reduce repeat issues."],
        ["Next step", "Book an inspection or request a quote."]
      ]
    };
  
    if (pestTitle) pestTitle.textContent = label;
    if (pestDesc) pestDesc.textContent = data.desc;
  
    if (pestBullets) {
      pestBullets.innerHTML = "";
      data.bullets.forEach(([h, t]) => {
        const div = document.createElement("div");
        div.className = "modal__item";
        div.innerHTML = `<strong>${h}</strong><span>${t}</span>`;
        pestBullets.appendChild(div);
      });
    }
  
    modal?.classList.add("is-open");
    modal?.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  
  function closeModal() {
    modal?.classList.remove("is-open");
    modal?.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  
  // Bind chip clicks (no HTML changes needed)
  document.querySelectorAll(".chips .chip").forEach((chip) => {
    chip.addEventListener("click", (e) => {
      e.preventDefault(); // stop jump-to-contact
      const label = (chip.textContent || "").trim();
      openModalForPest(label);
    });
  });
  
  // Close handlers
  modalBackdrop?.addEventListener("click", closeModal);
  modalClose?.addEventListener("click", closeModal);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("is-open")) closeModal();
  });
  // Subtle scroll reveal (Apple-ish)
(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
  
    const targets = document.querySelectorAll(
      ".trust__item, .card, .step, .quote, .panel, .info, .ratingbar"
    );
  
    targets.forEach(el => {
      el.style.opacity = "0";
      el.style.transform = "translateY(12px)";
    });
  
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.style.transition = "opacity .6s cubic-bezier(.2,.8,.2,1), transform .6s cubic-bezier(.2,.8,.2,1)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
        io.unobserve(el);
      });
    }, { threshold: 0.12 });
  
    targets.forEach(el => io.observe(el));
  })();
  