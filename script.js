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
  