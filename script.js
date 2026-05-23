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
  '.card, .section-title, .section-sub, .tl-item, .hero-inner > *'
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

/* ── HackTheBox live data ───────────────────────────────── */
function rankClass(rank) {
  if (!rank) return 'rank-beginner';
  return 'rank-' + rank.toLowerCase().replace(/\s+/g, '-');
}

function renderHTBLive(d) {
  const owns = (d.user_owns != null && d.system_owns != null)
    ? `<div class="htb-stat-box"><span class="htb-stat-num">${d.user_owns + d.system_owns}</span><span class="htb-stat-lbl">Machines Owned</span></div>`
    : '';
  const ranking = d.ranking
    ? `<div class="htb-stat-box"><span class="htb-stat-num">#${d.ranking.toLocaleString()}</span><span class="htb-stat-lbl">Global Rank</span></div>`
    : '';
  const avatar = d.avatar
    ? `<img src="${d.avatar}" alt="${d.name}" class="htb-avatar" />`
    : `<div class="htb-avatar-box"><i class="fas fa-cube htb-cube-icon"></i></div>`;

  return `
    <div class="htb-header">
      ${avatar}
      <div class="htb-header-info">
        <h3 class="htb-name">${d.name}</h3>
        <div class="htb-meta">
          <span class="htb-rank-badge ${rankClass(d.rank)}">${d.rank || 'Beginner'}</span>
          ${d.country ? `<span class="htb-loc"><i class="fas fa-location-dot"></i> ${d.country}</span>` : ''}
        </div>
      </div>
      <a href="https://profile.hackthebox.com/${d.name}" class="btn btn-htb" target="_blank" rel="noopener">
        <i class="fas fa-arrow-up-right-from-square"></i> View Profile
      </a>
    </div>
    <div class="htb-stats-row">
      <div class="htb-stat-box">
        <span class="htb-stat-num">${d.level ?? '—'}</span>
        <span class="htb-stat-lbl">Level</span>
      </div>
      <div class="htb-stat-box">
        <span class="htb-stat-num">${d.points != null ? d.points : '—'}</span>
        <span class="htb-stat-lbl">Points</span>
      </div>
      ${owns}
      ${ranking}
    </div>
  `;
}

async function loadHTB() {
  const loading  = document.getElementById('htbLoading');
  const live     = document.getElementById('htbLive');
  const fallback = document.getElementById('htbFallback');

  try {
    const res = await fetch('/.netlify/functions/htb');
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    live.innerHTML = renderHTBLive(data);
    loading.classList.add('hidden');
    live.classList.remove('hidden');

    const achieveDetail = document.getElementById('htbAchieveDetail');
    if (achieveDetail && (data.rank || data.level)) {
      achieveDetail.textContent = `Rank: ${data.rank || 'Beginner'} · Level ${data.level ?? '—'} — working through HTB Academy modules and Beginner-track challenges`;
    }
  } catch {
    loading.classList.add('hidden');
    fallback.classList.remove('hidden');
  }
}

/* ── Certificates from certs.json ──────────────────────── */
function certPlatformIcon(issuer) {
  const low = (issuer || '').toLowerCase();
  if (low.includes('google'))  return 'google';
  if (low.includes('ncsa') || low.includes('mooc')) return 'ncsa';
  return 'default';
}

function certPlatformLabel(issuer) {
  const low = (issuer || '').toLowerCase();
  if (low.includes('google'))  return '<i class="fab fa-google"></i>';
  if (low.includes('ncsa') || low.includes('mooc')) return '<i class="fas fa-shield-halved"></i>';
  if (low.includes('nsrc') || low.includes('kasetsart') || low.includes('thairen')) return '<i class="fas fa-cloud"></i>';
  return '<i class="fas fa-graduation-cap"></i>';
}

function renderCertCard(c) {
  const iconClass = certPlatformIcon(c.issuer);
  const iconLabel = certPlatformLabel(c.issuer);
  const grade  = c.grade    ? `<div class="cert-grade"><i class="fas fa-star"></i> ${c.grade}${c.hours ? ' &nbsp;·&nbsp; ' + c.hours : ''}</div>` : '';
  const certId = c.cert_id  ? `<div class="cert-id"><i class="fas fa-fingerprint"></i> ${c.cert_id}</div>` : '';
  const tags   = (c.skills || []).map(s => `<span class="tag sm">${s}</span>`).join('');

  return `
    <div class="cert-card reveal">
      <div class="cert-card-top">
        <div class="cert-platform-icon ${iconClass}">${iconLabel}</div>
        <div class="cert-meta">
          <span class="cert-issuer">${c.issuer}</span>
          <span class="cert-date">${c.date}${c.platform ? ' · ' + c.platform : ''}</span>
        </div>
      </div>
      <h4 class="cert-title">${c.title}</h4>
      ${grade}
      ${certId}
      <div class="tags">${tags}</div>
      ${c.link ? `<a href="${c.link}" class="cert-btn" target="_blank" rel="noopener"><i class="fas fa-arrow-up-right-from-square"></i> Verify Certificate</a>` : ''}
    </div>
  `;
}

function populateGrid(certs, gridId, countId) {
  const grid  = document.getElementById(gridId);
  const count = document.getElementById(countId);
  if (!grid) return;

  if (!certs || certs.length === 0) {
    grid.innerHTML = `<p style="color:var(--muted);font-size:.88rem;padding:.5rem 0">No certificates added yet — edit <code>certs.json</code> to add some.</p>`;
    if (count) count.textContent = '0';
    return;
  }

  grid.innerHTML = certs.map(renderCertCard).join('');
  if (count) count.textContent = certs.length;

  // Observe new cards for scroll-reveal
  grid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

async function loadCerts() {
  try {
    const res  = await fetch('/certs.json');
    if (!res.ok) throw new Error();
    const data = await res.json();
    populateGrid(data.coursera || [], 'courseraGrid',  'courseraCount');
    populateGrid(data.ncsa     || [], 'ncsaGrid',      'ncsaCount');
    populateGrid(data.workshop || [], 'workshopGrid',  'workshopCount');
  } catch {
    ['courseraGrid','ncsaGrid'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = `<p style="color:var(--muted);font-size:.88rem">Could not load certificates.</p>`;
    });
  }
}

/* ── Certificate tabs ───────────────────────────────────── */
document.querySelectorAll('.cert-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.cert-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.cert-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById(`panel-${tab.dataset.tab}`);
    if (panel) panel.classList.add('active');
  });
});

/* ── Init async loads ───────────────────────────────────── */
loadHTB();
loadCerts();

/* ── GA4 section dwell-time tracking ───────────────────── */
const sectionTimers = {};
const dwellObserver = new IntersectionObserver(
  entries => entries.forEach(e => {
    const id = e.target.id;
    if (e.isIntersecting) {
      sectionTimers[id] = Date.now();
    } else if (sectionTimers[id]) {
      const seconds = Math.round((Date.now() - sectionTimers[id]) / 1000);
      if (seconds > 1 && typeof gtag !== 'undefined') {
        gtag('event', 'section_dwell', {
          section_id: id,
          seconds_spent: seconds,
        });
      }
      delete sectionTimers[id];
    }
  }),
  { threshold: 0.3 }
);

document.querySelectorAll('section[id]').forEach(sec => dwellObserver.observe(sec));
