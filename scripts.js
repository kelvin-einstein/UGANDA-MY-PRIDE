
// Smooth scroll for navigation links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Hero CTA button
document.querySelector('.cta-button')?.addEventListener('click', () => {
    document.querySelector('#destinations')?.scrollIntoView({ behavior: 'smooth' });
});

// Contact form
document.querySelector('.contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you! Your inquiry has been received. We will get back to you soon.');
    this.reset();
});
