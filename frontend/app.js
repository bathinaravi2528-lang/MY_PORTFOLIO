// ═══════════════════════════════════════════════════
//  1. UI & INTERACTIVITY (Old script.js)
// ═══════════════════════════════════════════════════

// 1. THEME TOGGLE
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isLight = body.classList.toggle('light');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
}

// Apply saved theme
if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light');
}

// 2. SCROLL REVEAL (Intersection Observer)
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); // Reveal only once
        }
    });
}, { threshold: 0.1 });

// Reveal all elements with reveal classes
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

// 3. ACTIVE NAV LINK ON SCROLL
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.page-section');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    });
}, { threshold: 0.5 });

// Only observe sections if they exist on the page
sections.forEach(section => navObserver.observe(section));

// 4. SMOOTH NAVIGATION (Click Handling)
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// 5. NAVBAR SCROLL EFFECT
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// 6. HERO TYPING EFFECT
(function initTypingEffect() {
    const typedEl = document.getElementById('typed-role');
    if (!typedEl) return;

    const phrases = [
        'modern web apps.',
        'beautiful interfaces.',
        'AI-powered tools.',
        'full stack solutions.',
        'seamless experiences.'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typedEl.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typedEl.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2000;
            isDeleting = true;
        }
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400;
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 800);
})();

// 7. HERO PARTICLE NETWORK
(function initParticles() {
    const canvas = document.getElementById('hero-particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let mouseX = -1000;
    let mouseY = -1000;

    function resize() {
        const section = canvas.parentElement;
        canvas.width = section.offsetWidth;
        canvas.height = section.offsetHeight;
    }

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const force = (120 - dist) / 120;
                this.x += (dx / dist) * force * 2;
                this.y += (dy / dist) * force * 2;
            }
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        draw() {
            const isLight = document.body.classList.contains('light');
            const color = isLight ? `rgba(2, 132, 199, ${this.opacity})` : `rgba(0, 229, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        }
    }

    function drawConnections() {
        const isLight = document.body.classList.contains('light');
        const maxDist = 130;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDist) {
                    const opacity = (1 - dist / maxDist) * 0.15;
                    const color = isLight ? `rgba(2, 132, 199, ${opacity})` : `rgba(0, 229, 255, ${opacity})`;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        animationId = requestAnimationFrame(animate);
    }

    function init() {
        resize();
        const area = canvas.width * canvas.height;
        const count = Math.min(Math.floor(area / 12000), 80);
        particles = [];
        for (let i = 0; i < count; i++) { particles.push(new Particle()); }
        if (animationId) cancelAnimationFrame(animationId);
        animate();
    }

    const heroSection = canvas.parentElement;
    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });
    heroSection.addEventListener('mouseleave', () => { mouseX = -1000; mouseY = -1000; });
    window.addEventListener('resize', init);
    init();
})();

// 8. MAGNETIC EFFECT
const magneticElements = document.querySelectorAll('.btn, .hero-social-link, .social-btn');
magneticElements.forEach(el => {
    el.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        this.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    el.addEventListener('mouseleave', function() { this.style.transform = `translate(0, 0)`; });
});

// 9. HERO CARD PARALLAX
const heroCard = document.querySelector('.hero-visual-card');
if (heroCard) {
    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        heroCard.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
}

// 10. TECH CARD SPOTLIGHT
const techCards = document.querySelectorAll('.tech-card');
techCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
    });
});

// ═══════════════════════════════════════════════════
//  11. BACKEND API INTEGRATION (Old index.html scripts)
// ═══════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
    const username = "ravi_varma25";
    // Dynamic BASE_URL for local dev vs Vercel deployment
    const BASE_URL = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost' 
        ? "http://127.0.0.1:8000" 
        : "/api";

    // --- LEETCODE FETCH ---
    const lcStatusEl = document.getElementById('lc-status');
    fetch(`${BASE_URL}/leetcode/${username}`)
        .then(res => res.json())
        .then(data => {
            if (document.getElementById('lc-total')) {
                document.getElementById('lc-total').innerText = data.totalSolved;
                document.getElementById('lc-easy').innerText = data.easySolved;
                document.getElementById('lc-medium').innerText = data.mediumSolved;
                document.getElementById('lc-hard').innerText = data.hardSolved;
                document.getElementById('lc-rank').innerText = data.ranking.toLocaleString();
                document.getElementById('lc-contest').innerText = data.contestRating || 'N/A';
                if (lcStatusEl) lcStatusEl.innerText = "Live Data Connected";
            }
        })
        .catch(err => {
            if (lcStatusEl) lcStatusEl.innerText = "Local API Offline";
            console.error('LeetCode Fetch Error:', err);
        });

    // --- CODECHEF FETCH ---
    const ccStatusEl = document.getElementById('cc-status');
    const ccFooter = document.getElementById('cc-status-footer');
    fetch(`${BASE_URL}/codechef/${username}`)
        .then(res => res.json())
        .then(data => {
            if (document.getElementById('cc-rating')) {
                document.getElementById('cc-rating').innerText = data.rating;
                document.getElementById('cc-highest').innerText = data.highestRating;
                document.getElementById('cc-solved').innerText = data.solved;
                if (ccStatusEl) ccStatusEl.innerText = "Live Data Connected";
                if (ccFooter) ccFooter.classList.add('active');
            }
        })
        .catch(err => {
            if (ccStatusEl) ccStatusEl.innerText = "API Offline";
            console.error('CodeChef Fetch Error:', err);
        });

    // --- CONTACT FORM HANDLER ---
    const form = document.getElementById('web3forms-contact');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: json
            })
                .then(async (response) => {
                    let jsonResponse = await response.json();
                    if (response.status == 200) {
                        formStatus.style.display = 'block';
                        formStatus.style.color = '#10b981';
                        formStatus.innerText = 'Message sent successfully!';
                        form.reset();
                    } else {
                        formStatus.style.display = 'block';
                        formStatus.style.color = '#ef4444';
                        formStatus.innerText = jsonResponse.message ? jsonResponse.message : 'Oops! Something went wrong.';
                    }
                })
                .catch(error => {
                    formStatus.style.display = 'block';
                    formStatus.style.color = '#ef4444';
                    formStatus.innerText = 'Oops! There was a problem sending your message.';
                })
                .finally(() => {
                    submitBtn.innerText = originalBtnText;
                    submitBtn.style.opacity = '1';
                    submitBtn.disabled = false;
                    setTimeout(() => { formStatus.style.display = 'none'; }, 5000);
                });
        });
    }
});
