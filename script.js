// ── THEME ──
const toggle = document.getElementById('themeToggle');
const html = document.documentElement;

const saved = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
setTheme(saved);

function setTheme(t) {
    html.setAttribute('data-theme', t);
    toggle.textContent = t === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', t);
}
toggle.addEventListener('click', () => {
    setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// ── HAMBURGER / MOBILE NAV ──
const hamburger = document.getElementById('navHamburger');
const drawer = document.getElementById('navDrawer');

hamburger.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

// close drawer on link click
drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        drawer.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// ── SCROLL REVEAL ──
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── MODAL ──
let currentImages = [];
let currentSlide = 0;

function openModal(id) {
    const modal = document.getElementById(id);
    const imgs = modal.querySelectorAll('.screenshot-gallery img');
    currentImages = Array.from(imgs).map(i => i.src);
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
    document.body.style.overflow = '';
}

function handleModalClick(e, id) {
    if (e.target === e.currentTarget) closeModal(id);
}

// ── FULLSCREEN SLIDER ──
function openFullscreen(idx) {
    currentSlide = idx;
    document.getElementById('imageSlider').classList.add('open');
    showSlide(currentSlide);
}

function closeSlider() {
    document.getElementById('imageSlider').classList.remove('open');
}

function changeSlide(n) {
    currentSlide = (currentSlide + n + currentImages.length) % currentImages.length;
    showSlide(currentSlide);
}

function showSlide(n) {
    document.getElementById('sliderImage').src = currentImages[n];
}

// keyboard nav
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeSlider();
        document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
        document.body.style.overflow = '';
        drawer.classList.remove('open');
        hamburger.classList.remove('open');
    }
    if (e.key === 'ArrowRight') changeSlide(1);
    if (e.key === 'ArrowLeft') changeSlide(-1);
});

// swipe on slider (touch)
let touchStartX = 0;
const slider = document.getElementById('imageSlider');
slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
slider.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) changeSlide(diff > 0 ? 1 : -1);
});