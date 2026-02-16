// ============================================
// SYDNEY ADVANCED PEST CONTROL - INTERACTIONS
// Mobile Menu, Animations, Form Handling
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // MOBILE MENU
    // ============================================
    
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const closeMenu = document.getElementById('closeMenu');
    const body = document.body;
    
    // Open mobile menu
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            mobileMenuOverlay.classList.add('active');
            body.style.overflow = 'hidden';
        });
    }
    
    // Close mobile menu
    if (closeMenu) {
        closeMenu.addEventListener('click', function() {
            mobileMenuOverlay.classList.remove('active');
            body.style.overflow = '';
        });
    }
    
    // Close menu when clicking on a link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuOverlay.classList.remove('active');
            body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    mobileMenuOverlay.addEventListener('click', function(e) {
        if (e.target === mobileMenuOverlay) {
            mobileMenuOverlay.classList.remove('active');
            body.style.overflow = '';
        }
    });
    
    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-animation attribute
    const animatedElements = document.querySelectorAll('[data-animation]');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
    
    // ============================================
    // FAQ ACCORDION
    // ============================================
    
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(faq => {
                    faq.classList.remove('active');
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
    
    // ============================================
    // CONTACT FORM HANDLING
    // ============================================
    
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                pest: document.getElementById('pest').value,
                message: document.getElementById('message').value
            };
            
            // Here you would normally send this data to a server
            console.log('Form submitted:', formData);
            
            // Show success message
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';
            
            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // In a real implementation, you would send this to your backend:
            // fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // })
            // .then(response => response.json())
            // .then(data => {
            //     contactForm.style.display = 'none';
            //     formSuccess.style.display = 'block';
            // })
            // .catch(error => {
            //     console.error('Error:', error);
            //     alert('Sorry, there was an error submitting your form. Please try again.');
            // });
        });
    }
    
    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only apply smooth scroll to actual anchor links, not empty #
            if (href && href !== '#' && href.indexOf('#') === 0) {
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ============================================
    // PARALLAX EFFECT FOR HERO BACKGROUND
    // ============================================
    
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            if (scrolled < window.innerHeight) {
                heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        });
    }
    
    // ============================================
    // ADD ANIMATION DELAYS TO STAGGERED ELEMENTS
    // ============================================
    
    function addAnimationDelays(selector, delayIncrement = 100) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.style.transitionDelay = `${index * delayIncrement}ms`;
        });
    }
    
    // Apply staggered delays
    addAnimationDelays('.service-card', 100);
    addAnimationDelays('.process-card', 150);
    addAnimationDelays('.approach-card', 100);
    addAnimationDelays('.service-detail-card', 100);
    addAnimationDelays('.why-list li', 80);
    addAnimationDelays('.credentials-list li', 80);
    
    // ============================================
    // PHONE NUMBER CLICK TRACKING (Optional)
    // ============================================
    
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Phone call initiated:', this.href);
            // Here you could add analytics tracking
            // gtag('event', 'phone_call', { 'phone_number': this.href });
        });
    });
    
    // ============================================
    // PREVENT EMPTY FORM FIELDS
    // ============================================
    
    const requiredInputs = document.querySelectorAll('input[required], select[required], textarea[required]');
    requiredInputs.forEach(input => {
        input.addEventListener('invalid', function(e) {
            e.preventDefault();
            this.classList.add('error');
        });
        
        input.addEventListener('input', function() {
            this.classList.remove('error');
        });
    });
    
    // ============================================
    // LAZY LOAD IMAGES (if you add images later)
    // ============================================
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // ============================================
    // CONSOLE MESSAGE
    // ============================================
    
    console.log('%c🐛 Sydney Advanced Pest Control', 'font-size: 20px; font-weight: bold; color: #C41E3A;');
    console.log('%cWebsite loaded successfully', 'font-size: 14px; color: #666;');
    
});

// ============================================
// ADDITIONAL UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add debounced resize handler if needed
window.addEventListener('resize', debounce(function() {
    // Handle responsive adjustments if needed
    console.log('Window resized');
}, 250));
