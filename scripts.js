// ============================================
// KELVIN EINSTEIN — Scripts + Theme + Lightbox + Form
// ============================================

// Mobile nav
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('open');
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('open');
        });
    });
}

// Active page highlight
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
    }
});

// Theme toggle with localStorage
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    const saved = localStorage.getItem('kelvin_theme');
    if (saved === 'light') document.body.classList.add('light-mode');

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        localStorage.setItem('kelvin_theme',
            document.body.classList.contains('light-mode') ? 'light' : 'dark'
        );
    });
}

// Typewriter effect
const typewriterEl = document.getElementById('typewriter');
if (typewriterEl) {
    const phrases = [
        'Computer Expert',
        'Technologist',
        'Digital Innovator',
        'Systems Thinker',
        'AI Enthusiast',
        'Problem Solver',
        'From Bududa, Uganda'
    ];
    let phraseIndex = 0, charIndex = 0, isDeleting = false, typingSpeed = 90;
    function type() {
        const current = phrases[phraseIndex];
        if (isDeleting) {
            typewriterEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 45;
        } else {
            typewriterEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 90;
        }
        if (!isDeleting && charIndex === current.length) {
            isDeleting = true;
            typingSpeed = 1800;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400;
        }
        setTimeout(type, typingSpeed);
    }
    setTimeout(type, 600);
}

// Scroll reveal (fallback for browsers without animation-timeline)
if (!CSS.supports('animation-timeline', 'view()')) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.scroll-reveal, .feature-card, .stat-item, .content-with-img, .content-block, .skill-bar-wrap').forEach(el => observer.observe(el));
}

// Local comments (index & contact)
const commentForm = document.getElementById('commentForm');
const commentList = document.getElementById('commentList');
if (commentForm && commentList) {
    const STORAGE_KEY = 'kelvin_einstein_comments';
    function loadComments() {
        const comments = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        commentList.innerHTML = '';
        if (comments.length === 0) {
            commentList.innerHTML = '<p style="color:var(--text-muted);font-size:0.9rem;">No comments yet. Be the first!</p>';
            return;
        }
        comments.slice().reverse().forEach(c => {
            const div = document.createElement('div');
            div.className = 'comment-item';
            div.innerHTML = `<div class="comment-author">${escapeHtml(c.name)}</div>
                <div class="comment-text">${escapeHtml(c.text)}</div>
                <div class="comment-time">${c.time}</div>`;
            commentList.appendChild(div);
        });
    }
    function escapeHtml(str) {
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('commentName').value.trim();
        const text = document.getElementById('commentText').value.trim();
        if (!name || !text) return;
        const comments = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        comments.push({ name, text, time: new Date().toLocaleString() });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
        commentForm.reset();
        loadComments();
    });
    loadComments();
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ========== LIGHTBOX (Gallery & Fashion) ==========
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDesc = document.getElementById('lightboxDesc');
const closeLightbox = document.getElementById('closeLightbox');

if (lightbox) {
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxTitle.textContent = item.dataset.title || '';
            lightboxDesc.textContent = item.dataset.desc || '';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLb() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    if (closeLightbox) closeLightbox.addEventListener('click', closeLb);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLb();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLb();
    });
}

// ========== SKILL BARS ANIMATION ==========
const skillBars = document.querySelectorAll('.skill-bar-fill');
if (skillBars.length) {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.dataset.width || '80%';
                bar.style.width = width;
                skillObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });
    skillBars.forEach(bar => {
        bar.style.width = '0';
        skillObserver.observe(bar);
    });
}

// ========== CONTACT FORM (Formspree) ==========
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const status = document.getElementById('formStatus');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                status.textContent = 'Thank you! Your message has been sent.';
                status.className = 'form-status success';
                contactForm.reset();
            } else {
                throw new Error('Failed');
            }
        } catch (err) {
            status.textContent = 'Something went wrong. Please email me directly or try again.';
            status.className = 'form-status error';
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });
}

// Prefer reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.scrollBehavior = 'auto';
}

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
}
