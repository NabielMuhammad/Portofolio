/* ============================================
   PORTFOLIO — JAVASCRIPT
   ============================================ */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initSmoothScroll();
    if (!prefersReducedMotion) {
        initParticles();
        initTiltEffect();
        initMagneticHover();
    }
    initTypingEffect();
    initProjectFilter();
    initGalleryModal();
    initBackToTop();
});

/* ============================================
   PARTICLE BACKGROUND
   ============================================ */
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = document.getElementById('hero').offsetHeight || window.innerHeight;
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.color = Math.random() > 0.5 ? 'rgba(124, 58, 237, 0.4)' : 'rgba(6, 182, 212, 0.4)';
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx = -this.vx;
            if (this.y < 0 || this.y > height) this.vy = -this.vy;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }
    
    const particleCount = Math.min(Math.floor(window.innerWidth / 15), 100);
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => { p.update(); p.draw(); });
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const opacity = 1 - (dist / 150);
                    ctx.strokeStyle = `rgba(124, 58, 237, ${opacity * 0.15})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

/* ============================================
   TYPING EFFECT
   ============================================ */
function initTypingEffect() {
    const roles = ["AI/ML Engineer", "Software Developer", "Data Enthusiast"];
    const typeTarget = document.querySelector('.typed-text');
    if (!typeTarget) return;

    if (prefersReducedMotion) { typeTarget.textContent = roles[0]; return; }
    
    let roleIndex = 0, charIndex = 0, isDeleting = false, typingSpeed = 100;
    
    function type() {
        const currentRole = roles[roleIndex];
        if (isDeleting) {
            typeTarget.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typeTarget.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150;
        }
        
        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500;
        }
        setTimeout(type, typingSpeed);
    }
    setTimeout(type, 1500);
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => observer.observe(el));
    
    // Immediately reveal elements already in viewport
    setTimeout(() => {
        reveals.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('active');
                observer.unobserve(el);
            }
        });
    }, 100);
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') { e.preventDefault(); return; }
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* ============================================
   DYNAMIC GLARE (HD CRISP — NO BLUR TILT)
   ============================================ */
function initTiltEffect() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const cards = document.querySelectorAll('.bento-card');

    cards.forEach(card => {
        const glare = card.querySelector('.glare');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (glare) {
                const glareX = (x / rect.width) * 100;
                const glareY = (y / rect.height) * 100;
                glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.12), transparent 60%)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            if (glare) {
                glare.style.background = `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1), transparent 60%)`;
            }
        });
    });
}

/* Custom Cursor removed */

/* ============================================
   MAGNETIC HOVER
   ============================================ */
function initMagneticHover() {
    const magnetics = document.querySelectorAll('.pill-link, .btn, .filter-btn, .social-icon-link');
    
    magnetics.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = `translate(0px, 0px)`;
            el.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
            setTimeout(() => { el.style.transition = ''; }, 400);
        });
    });
}

/* ============================================
   PROJECT FILTER
   ============================================ */
function initProjectFilter() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');
    if (!buttons.length || !cards.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            cards.forEach(card => {
                const matches = filter === 'all' || card.dataset.category === filter;
                card.classList.toggle('hidden', !matches);
                if (matches) {
                    card.classList.add('reveal', 'active');
                }
            });
        });
    });
}

/* ============================================
   BACK TO TOP
   ============================================ */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => { btn.classList.toggle('visible', window.scrollY > 600); });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
}

/* ============================================
   FULLSCREEN HD PROJECT GALLERY MODAL & SLIDER
   ============================================ */
function initGalleryModal() {
    let modal = document.getElementById('image-lightbox');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'image-lightbox';
        modal.className = 'image-lightbox';
        modal.innerHTML = `
            <div class="lightbox-header">
                <div class="lightbox-title-box">
                    <h4 class="lightbox-project-title">Galeri Proyek</h4>
                    <span class="lightbox-counter">1 / 1</span>
                </div>
                <div class="lightbox-actions">
                    <a href="#" target="_blank" class="lightbox-btn" id="lightbox-raw-link" title="Buka Gambar Resolusi Penuh di Tab Baru">
                        <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
                    </a>
                    <button class="lightbox-btn lightbox-close" aria-label="Tutup Galeri">
                        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
            <div class="lightbox-stage">
                <button class="lightbox-nav prev" aria-label="Foto sebelumnya">
                    <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
                </button>
                <div class="lightbox-img-wrapper">
                    <img src="" alt="" class="lightbox-img">
                </div>
                <button class="lightbox-nav next" aria-label="Foto berikutnya">
                    <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                </button>
            </div>
            <div class="lightbox-footer">
                <p class="lightbox-caption"></p>
                <div class="lightbox-thumbnails"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

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

    function renderSlide(index) {
        if (!currentItems.length) return;
        if (index < 0) index = currentItems.length - 1;
        if (index >= currentItems.length) index = 0;
        currentIndex = index;

        const item = currentItems[currentIndex];
        imgEl.style.opacity = '0';
        setTimeout(() => {
            imgEl.src = item.src;
            imgEl.alt = item.caption || '';
            imgEl.style.opacity = '1';
        }, 120);

        rawLink.href = item.src;
        captionEl.textContent = item.caption || '';
        counterEl.textContent = `${currentIndex + 1} / ${currentItems.length}`;

        // Update thumbnails active state
        const allThumbs = thumbsContainer.querySelectorAll('.lightbox-thumb');
        allThumbs.forEach((t, i) => {
            t.classList.toggle('active', i === currentIndex);
        });

        // Hide arrows if only 1 item
        if (currentItems.length <= 1) {
            prevBtn.classList.add('hidden');
            nextBtn.classList.add('hidden');
            thumbsContainer.style.display = 'none';
        } else {
            prevBtn.classList.remove('hidden');
            nextBtn.classList.remove('hidden');
            thumbsContainer.style.display = 'flex';
        }
    }

    function openGallery(title, items, startIndex = 0) {
        currentItems = items;
        titleEl.textContent = title || 'Galeri Proyek';
        
        // Build thumbnails
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
        document.body.style.overflow = 'hidden';
    }

    function closeGallery() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            imgEl.src = '';
            currentItems = [];
        }, 300);
    }

    // Navigation events
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        renderSlide(currentIndex - 1);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        renderSlide(currentIndex + 1);
    });

    closeBtn.addEventListener('click', closeGallery);
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('lightbox-stage') || e.target.classList.contains('lightbox-img-wrapper')) {
            closeGallery();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeGallery();
        if (e.key === 'ArrowLeft') renderSlide(currentIndex - 1);
        if (e.key === 'ArrowRight') renderSlide(currentIndex + 1);
    });

    // Mobile touch swipe inside lightbox
    let touchStartX = 0;
    modal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    modal.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
            renderSlide(currentIndex + 1);
        } else if (touchEndX - touchStartX > 50) {
            renderSlide(currentIndex - 1);
        }
    }, { passive: true });

    // Attach trigger to all project gallery wrappers
    document.querySelectorAll('.project-gallery-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const title = trigger.dataset.galleryTitle || 'Detail Proyek';
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
                openGallery(title, items, 0);
            }
        });
    });

    // Also attach to About profile photo
    const aboutPhoto = document.querySelector('.about-photo-img');
    if (aboutPhoto) {
        aboutPhoto.addEventListener('click', (e) => {
            e.stopPropagation();
            openGallery('Foto Potret Profesional', [{
                src: aboutPhoto.src,
                caption: 'Nabiel Muhammad Imjauzanansyah — AI/ML Engineer & Software Developer'
            }], 0);
        });
    }
}
