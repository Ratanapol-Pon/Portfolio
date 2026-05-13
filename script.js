/* ── Typing animation ──────────────────────────────────── */
const roles = [
  'Cybersecurity Student',
  'Network Security Enthusiast',
  'CTF Competitor',
  'Penetration Tester (Aspiring)',
  'SIEM & Log Analyst',
  'OSCP Candidate',
];

let roleIdx = 0, charIdx = 0, deleting = false;
const typeEl = document.getElementById('typeTarget');

function type() {
  const word = roles[roleIdx];
  typeEl.textContent = deleting
    ? word.slice(0, charIdx - 1)
    : word.slice(0, charIdx + 1);

  deleting ? charIdx-- : charIdx++;

  if (!deleting && charIdx === word.length) {
    setTimeout(() => { deleting = true; }, 2200);
  } else if (deleting && charIdx === 0) {
    deleting = false;
    roleIdx = (roleIdx + 1) % roles.length;
  }

  setTimeout(type, deleting ? 45 : 75);
}

type();

/* ── Navbar scroll + active link ───────────────────────── */
const navbar  = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function updateNav() {
  const scrollY = window.scrollY;

  // Scrolled class
  navbar.classList.toggle('scrolled', scrollY > 40);

  // Active link highlight
  sections.forEach(sec => {
    const top    = sec.offsetTop - 110;
    const bottom = top + sec.offsetHeight;
    const id     = sec.getAttribute('id');
    const link   = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < bottom);
  });
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ── Mobile hamburger ───────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});

navMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navMenu.classList.remove('open'));
});

/* ── Scroll-reveal (IntersectionObserver) ─────────────── */
const observer = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.08 }
);

document.querySelectorAll(
  '.glass-card, .section-title, .section-sub, .tl-item, .hero-text > *'
).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 5) * 0.07}s`;
  observer.observe(el);
});

/* ── Smooth anchor scroll ───────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
