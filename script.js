/* ==========================================================================
   NABIEEL MUHAMMAD — PORTFOLIO JAVASCRIPT
   Powered by Framer Motion / Motion DOM Engine & Vanilla Modern JS
   ========================================================================== */

document.documentElement.classList.add('js');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
    initMotionScrollProgress();
    initMotionScrollReveal();
    initMotionSpringHover();
    initNavbarScrollspy();
    initSmoothNavigation();
    initTypingEffect();
    initCodeWindowCopy();
    initProjectFiltering();
    initCertificationsAccordion();
    initImageLightbox();
    initBackToTop();
});

/* ============================================
   1. FRAMER MOTION: SCROLL PROGRESS BAR
   ============================================ */
function initMotionScrollProgress() {
    const progressBar = document.getElementById('scroll-progress-bar');
    if (!progressBar) return;

    if (window.Motion && typeof window.Motion.scroll === 'function') {
        window.Motion.scroll((progress) => {
            progressBar.style.transform = `scaleX(${progress})`;
        });
    } else {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? scrollTop / docHeight : 0;
            progressBar.style.transform = `scaleX(${progress})`;
        }, { passive: true });
    }
}

/* ============================================
   2. FRAMER MOTION: STAGGERED SPRING SCROLL REVEALS
   ============================================ */
function initMotionScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    if (prefersReducedMotion) {
        revealElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    if (window.Motion && typeof window.Motion.inView === 'function' && typeof window.Motion.animate === 'function') {
        window.Motion.inView('.reveal', (element) => {
            let delay = 0;
            if (element.classList.contains('delay-100')) delay = 0.1;
            else if (element.classList.contains('delay-200')) delay = 0.2;
            else if (element.classList.contains('delay-300')) delay = 0.3;

            window.Motion.animate(element, {
                opacity: [0, 1],
                transform: ['translateY(24px)', 'translateY(0px)']
            }, {
                duration: 0.6,
                delay: delay,
                easing: [0.16, 1, 0.3, 1] // Apple / Framer spring curve
            });
        }, { margin: '0px 0px -40px 0px' });
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(24px)';
            observer.observe(el);
        });
    }
}

/* ============================================
   3. FRAMER MOTION: SPRING HOVER & PRESS GESTURES
   ============================================ */
function initMotionSpringHover() {
    if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;
    if (!window.Motion || typeof window.Motion.animate !== 'function') return;

    // Interactive spring cards (lift with subtle spring physics)
    const springCards = document.querySelectorAll('.project-card, .exp-card, .cert-bnsp-card, .skill-domain-card');
    springCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            window.Motion.animate(card, {
                transform: 'translateY(-5px)'
            }, { duration: 0.3, easing: [0.34, 1.56, 0.64, 1] });
        });

        card.addEventListener('mouseleave', () => {
            window.Motion.animate(card, {
                transform: 'translateY(0px)'
            }, { duration: 0.25, easing: [0.16, 1, 0.3, 1] });
        });
    });

    // Spring button presses (subtle scale squeeze and release)
    const interactiveButtons = document.querySelectorAll('.btn, .filter-btn, .social-icon-btn, .code-copy-btn');
    interactiveButtons.forEach(btn => {
        btn.addEventListener('mousedown', () => {
            window.Motion.animate(btn, {
                transform: 'scale(0.95)'
            }, { duration: 0.1 });
        });

        const resetScale = () => {
            window.Motion.animate(btn, {
                transform: 'scale(1)'
            }, { duration: 0.25, easing: [0.34, 1.56, 0.64, 1] });
        };

        btn.addEventListener('mouseup', resetScale);
        btn.addEventListener('mouseleave', resetScale);
    });
}

/* ============================================
   4. CODE SNIPPET ONE-CLICK COPY
   ============================================ */
async function copyToClipboard(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fall through to fallback
        }
    }

    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        textArea.remove();
        return successful;
    } catch (e) {
        return false;
    }
}

function initCodeWindowCopy() {
    const copyBtn = document.getElementById('code-copy-btn');
    if (!copyBtn) return;

    const cleanPythonCode = `class NabielMuhammad:
    def __init__(self):
        self.role = "AI/ML & Software Engineer"
        self.origin = "Banda Aceh, Indonesia"
        self.education = "S1 Sistem Informasi (GPA 3.66)"
        self.stack = ["Python", "TensorFlow", "FastAPI", "RAG"]

    def build_impact(self):
        return "Transforming AI research into production"

me = NabielMuhammad()
print(me.build_impact())`;

    let resetTimer = null;

    copyBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const success = await copyToClipboard(cleanPythonCode);
        if (success || true) {
            copyBtn.classList.add('copied');
            const copyIcon = copyBtn.querySelector('.copy-icon');
            const checkIcon = copyBtn.querySelector('.check-icon');
            const label = copyBtn.querySelector('.copy-label');

            if (copyIcon) copyIcon.style.display = 'none';
            if (checkIcon) checkIcon.style.display = 'inline-block';
            if (label) label.textContent = 'Copied!';

            // Framer Motion spring pop on success
            if (window.Motion && typeof window.Motion.animate === 'function' && !prefersReducedMotion) {
                window.Motion.animate(copyBtn, {
                    transform: ['scale(1)', 'scale(1.1)', 'scale(1)']
                }, { duration: 0.3, easing: [0.34, 1.56, 0.64, 1] });
            }

            if (resetTimer) clearTimeout(resetTimer);
            resetTimer = setTimeout(() => {
                copyBtn.classList.remove('copied');
                if (copyIcon) copyIcon.style.display = 'inline-block';
                if (checkIcon) checkIcon.style.display = 'none';
                if (label) label.textContent = 'Copy';
            }, 2200);
        }
    });
}

/* ============================================
   5. NAVBAR SCROLLSPY & SMOOTH SCROLL
   ============================================ */
function initNavbarScrollspy() {
    const navLinks = document.querySelectorAll('.pill-nav .pill-link');
    const sections = Array.from(document.querySelectorAll('section[id], header[id]'));

    function setActiveLink(currentSectionId) {
        if (!currentSectionId) return;
        navLinks.forEach(link => {
            const target = link.getAttribute('href').replace('#', '');
            const isActive = target === currentSectionId;
            link.classList.toggle('active', isActive);
            if (isActive) {
                // Ensure active link is visible in scrollable pill nav on mobile
                const container = link.closest('.pill-nav');
                if (container && container.scrollWidth > container.clientWidth) {
                    const linkLeft = link.offsetLeft;
                    const linkWidth = link.offsetWidth;
                    const containerWidth = container.clientWidth;
                    const targetScroll = linkLeft - (containerWidth / 2) + (linkWidth / 2);
                    container.scrollTo({ left: targetScroll, behavior: 'smooth' });
                }
            }
        });
    }

    function updateActiveNav() {
        const isBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);
        if (isBottom) {
            setActiveLink('contact');
            return;
        }

        let currentSectionId = 'hero';
        const viewportCheckLine = 180;

        for (const section of sections) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= viewportCheckLine && rect.bottom > viewportCheckLine) {
                currentSectionId = section.getAttribute('id');
                break;
            }
        }

        setActiveLink(currentSectionId);
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
}

function initSmoothNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: prefersReducedMotion ? 'auto' : 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ============================================
   6. HERO TYPING EFFECT
   ============================================ */
function initTypingEffect() {
    const typeTarget = document.querySelector('.typed-text');
    if (!typeTarget) return;

    const roles = [
        "Applied Machine Learning",
        "Software Engineering",
        "Computer Vision & CNN-LSTM",
        "Enterprise RAG & Backend"
    ];

    if (prefersReducedMotion) {
        typeTarget.textContent = roles[0];
        return;
    }

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function tick() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typeTarget.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 45;
        } else {
            typeTarget.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2200;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 380;
        }

        setTimeout(tick, typingSpeed);
    }

    setTimeout(tick, 800);
}

/* ============================================
   7. PROJECT FILTERING (WITH FRAMER MOTION)
   ============================================ */
function initProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    if (!filterButtons.length || !projectItems.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.dataset.filter;

            projectItems.forEach(card => {
                const category = card.dataset.category || '';
                const matches = filterValue === 'all' || category.split(' ').includes(filterValue);

                if (matches) {
                    card.classList.remove('hidden');
                    if (window.Motion && typeof window.Motion.animate === 'function' && !prefersReducedMotion) {
                        window.Motion.animate(card, {
                            opacity: [0, 1],
                            transform: ['scale(0.96) translateY(12px)', 'scale(1) translateY(0px)']
                        }, { duration: 0.35, easing: [0.16, 1, 0.3, 1] });
                    }
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/* ============================================
   8. CERTIFICATIONS ACCORDION DRAWER
   ============================================ */
function initCertificationsAccordion() {
    const card = document.getElementById('cert-accordion');
    const toggleBtn = document.getElementById('cert-toggle-btn');
    if (!card || !toggleBtn) return;

    const chevron = card.querySelector('.cert-drawer-chevron');

    const toggleAccordion = () => {
        const isOpen = card.classList.toggle('open');
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

        // Framer Motion spring rotation on chevron
        if (chevron && window.Motion && typeof window.Motion.animate === 'function' && !prefersReducedMotion) {
            window.Motion.animate(chevron, {
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
            }, { duration: 0.35, easing: [0.34, 1.56, 0.64, 1] });
        }

        // Stagger entrance on items when expanded
        if (isOpen && window.Motion && typeof window.Motion.animate === 'function' && !prefersReducedMotion) {
            const items = card.querySelectorAll('.cert-compact-item');
            items.forEach((item, idx) => {
                window.Motion.animate(item, {
                    opacity: [0, 1],
                    transform: ['translateY(8px)', 'translateY(0px)']
                }, {
                    duration: 0.25,
                    delay: 0.04 + idx * 0.02,
                    easing: [0.16, 1, 0.3, 1]
                });
            });
        }
    };

    toggleBtn.addEventListener('click', toggleAccordion);
    toggleBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleAccordion();
        }
    });
}

/* ============================================
   9. FULLSCREEN HD IMAGE LIGHTBOX & SLIDER
   ============================================ */
function initImageLightbox() {
    const modal = document.getElementById('image-lightbox');
    if (!modal) return;

    const titleEl = modal.querySelector('.lightbox-project-title');
    const counterEl = modal.querySelector('.lightbox-counter');
    const rawLink = modal.querySelector('#lightbox-raw-link');
    const imgEl = modal.querySelector('.lightbox-img');
    const captionEl = modal.querySelector('.lightbox-caption');
    const prevBtn = modal.querySelector('.lightbox-nav.prev');
    const nextBtn = modal.querySelector('.lightbox-nav.next');
    const thumbsContainer = modal.querySelector('.lightbox-thumbnails');
    const closeBtn = modal.querySelector('.lightbox-close');

    let currentItems = [];
    let currentIndex = 0;
    let previousActiveElement = null;

    function renderSlide(index) {
        if (!currentItems.length) return;
        if (index < 0) index = currentItems.length - 1;
        if (index >= currentItems.length) index = 0;
        currentIndex = index;

        const item = currentItems[currentIndex];

        imgEl.style.opacity = '0';
        setTimeout(() => {
            imgEl.src = item.src;
            imgEl.alt = item.caption || titleEl.textContent;
            imgEl.style.opacity = '1';
            if (window.Motion && typeof window.Motion.animate === 'function' && !prefersReducedMotion) {
                window.Motion.animate(imgEl, {
                    opacity: [0, 1],
                    transform: ['scale(0.96)', 'scale(1)']
                }, { duration: 0.25, easing: [0.16, 1, 0.3, 1] });
            }
        }, 80);

        if (rawLink) rawLink.href = item.src;
        if (captionEl) captionEl.textContent = item.caption || '';
        if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${currentItems.length}`;

        // Update active thumbnail
        const thumbs = thumbsContainer.querySelectorAll('.lightbox-thumb');
        thumbs.forEach((t, i) => {
            t.classList.toggle('active', i === currentIndex);
        });

        // Hide navigation if only single item
        const isSingle = currentItems.length <= 1;
        if (prevBtn) prevBtn.classList.toggle('hidden', isSingle);
        if (nextBtn) nextBtn.classList.toggle('hidden', isSingle);
        if (thumbsContainer) thumbsContainer.style.display = isSingle ? 'none' : 'flex';
    }

    function openLightbox(title, items, startIndex = 0) {
        previousActiveElement = document.activeElement;
        currentItems = items;
        if (titleEl) titleEl.textContent = title || 'Pratinjau Gambar';

        // Build thumbnail strip
        thumbsContainer.innerHTML = '';
        if (items.length > 1) {
            items.forEach((item, i) => {
                const thumb = document.createElement('img');
                thumb.src = item.src;
                thumb.alt = `Thumbnail ${i + 1}`;
                thumb.className = 'lightbox-thumb' + (i === startIndex ? ' active' : '');
                thumb.addEventListener('click', () => renderSlide(i));
                thumbsContainer.appendChild(thumb);
            });
        }

        renderSlide(startIndex);
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Focus close button for accessibility
        if (closeBtn) closeBtn.focus();

        // Framer Motion pop-in
        if (window.Motion && typeof window.Motion.animate === 'function' && !prefersReducedMotion) {
            window.Motion.animate(imgEl, {
                transform: ['scale(0.92)', 'scale(1)'],
                opacity: [0, 1]
            }, { duration: 0.35, easing: [0.16, 1, 0.3, 1] });
        }
    }

    function closeLightbox() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        setTimeout(() => {
            imgEl.src = '';
            currentItems = [];
        }, 250);

        if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
            previousActiveElement.focus();
        }
    }

    // Controls
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            renderSlide(currentIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            renderSlide(currentIndex + 1);
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('lightbox-stage') || e.target.classList.contains('lightbox-img-wrapper')) {
            closeLightbox();
        }
    });

    // Keyboard navigation & Focus trapping
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') {
            e.preventDefault();
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            renderSlide(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            renderSlide(currentIndex + 1);
        } else if (e.key === 'Tab') {
            // Focus trap within modal
            const focusables = modal.querySelectorAll('button:not(.hidden), a[href]');
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

    // Touch swipe gestures
    let touchStartX = 0;
    modal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    modal.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (diff > 50) {
            renderSlide(currentIndex + 1);
        } else if (diff < -50) {
            renderSlide(currentIndex - 1);
        }
    }, { passive: true });

    // Attach trigger to all gallery wrappers
    document.querySelectorAll('.project-gallery-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const title = trigger.dataset.galleryTitle || 'Detail Gambar';
            const sourceElements = trigger.querySelectorAll('.gallery-sources [data-src]');
            let items = [];

            if (sourceElements.length) {
                sourceElements.forEach(el => {
                    items.push({
                        src: el.getAttribute('data-src'),
                        caption: el.getAttribute('data-caption') || ''
                    });
                });
            } else {
                const mainImg = trigger.querySelector('img');
                if (mainImg) {
                    items.push({
                        src: mainImg.src,
                        caption: mainImg.alt || title
                    });
                }
            }

            if (items.length) {
                openLightbox(title, items, 0);
            }
        });
    });
}

/* ============================================
   10. BACK TO TOP BUTTON
   ============================================ */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        const isVisible = window.scrollY > 400;
        btn.classList.toggle('visible', isVisible);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
    });
}
