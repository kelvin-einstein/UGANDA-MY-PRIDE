// ============================================
// KELVIN EINSTEIN — Scripts + Theme Toggle
// ============================================

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('active'));
    });
}

const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
    }
});

// Theme toggle
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

// Typewriter
const typewriterEl = document.getElementById('typewriter');
if (typewriterEl) {
    const phrases = ['Computer Expert', 'Technologist', 'Digital Innovator', 'Systems Thinker', 'AI Enthusiast', 'Problem Solver'];
    let phraseIndex = 0, charIndex = 0, isDeleting = false, typingSpeed = 90;
    function type() {
        const current = phrases[phraseIndex];
        if (isDeleting) {
            typewriterEl.textContent = current.substring(0, charIndex - 1);
            charIndex--; typingSpeed = 45;
        } else {
            typewriterEl.textContent = current.substring(0, charIndex + 1);
            charIndex++; typingSpeed = 90;
        }
        if (!isDeleting && charIndex === current.length) { isDeleting = true; typingSpeed = 1800; }
        else if (isDeleting && charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; typingSpeed = 400; }
        setTimeout(type, typingSpeed);
    }
    setTimeout(type, 600);
}

if (!CSS.supports('animation-timeline', 'view()')) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.scroll-reveal, .feature-card, .stat-item, .content-with-img, .content-block').forEach(el => observer.observe(el));
}

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

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});
