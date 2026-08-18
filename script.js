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

function setMenuOpen(open) {
  navMenu.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
}

hamburger.addEventListener('click', () => {
  setMenuOpen(!navMenu.classList.contains('open'));
});

navMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navMenu.classList.contains('open')) {
    setMenuOpen(false);
    hamburger.focus();
  }
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
  const machines   = d.user_owns      != null ? `<div class="htb-stat-box"><span class="htb-stat-num">${d.user_owns}</span><span class="htb-stat-lbl">Machines</span></div>` : '';
  const challenges = d.challenge_owns != null ? `<div class="htb-stat-box"><span class="htb-stat-num">${d.challenge_owns}</span><span class="htb-stat-lbl">Challenges</span></div>` : '';
  const ranking    = d.ranking        != null ? `<div class="htb-stat-box"><span class="htb-stat-num">#${d.ranking.toLocaleString()}</span><span class="htb-stat-lbl">Global Rank</span></div>` : '';
  const progress   = d.rank_progress  != null ? `<div class="htb-stat-box"><span class="htb-stat-num">${Math.round(d.rank_progress)}%</span><span class="htb-stat-lbl">To ${d.next_rank || 'Next Rank'}</span></div>` : '';
  const avatar = d.avatar
    ? `<img src="${d.avatar}" alt="${d.name}" class="htb-avatar" />`
    : `<div class="htb-avatar-box"><i class="fas fa-cube htb-cube-icon"></i></div>`;

  return `
    <div class="htb-header">
      ${avatar}
      <div class="htb-header-info">
        <h3 class="htb-name">${d.name}</h3>
        <div class="htb-meta">
          <span class="htb-rank-badge ${rankClass(d.rank)}">${d.rank || 'Noob'}</span>
          ${d.country ? `<span class="htb-loc"><i class="fas fa-location-dot"></i> ${d.country}</span>` : ''}
        </div>
      </div>
      <a href="https://app.hackthebox.com/profile/${d.id}" class="btn btn-htb" target="_blank" rel="noopener">
        <i class="fas fa-arrow-up-right-from-square"></i> View Profile
      </a>
    </div>
    <div class="htb-stats-row">
      ${machines}
      ${challenges}
      ${ranking}
      ${progress}
    </div>
  `;
}

const HTB_CACHE_KEY = 'htbCacheV1';

function updateRankStat(ranking) {
  const rankStat = document.getElementById('statHtbRank');
  if (rankStat && ranking != null) {
    rankStat.textContent = `#${Number(ranking).toLocaleString()}`;
  }
}

function updateAchieveDetail(data) {
  const achieveDetail = document.getElementById('htbAchieveDetail');
  if (achieveDetail && data.rank) {
    const progress = data.rank_progress != null ? ` · ${Math.round(data.rank_progress)}% to ${data.next_rank || 'next rank'}` : '';
    achieveDetail.textContent = `Rank: ${data.rank}${progress} — working through HTB challenges and Beginner track`;
  }
}

function readHTBCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(HTB_CACHE_KEY) || 'null');
    return cached && cached.data ? cached : null;
  } catch {
    return null;
  }
}

function writeHTBCache(data) {
  try {
    localStorage.setItem(HTB_CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch { /* storage unavailable — ignore */ }
}

function showHTB(html) {
  const loading = document.getElementById('htbLoading');
  const live    = document.getElementById('htbLive');
  live.innerHTML = html;
  loading.classList.add('hidden');
  live.classList.remove('hidden');
}

async function loadHTB() {
  const loading  = document.getElementById('htbLoading');
  const fallback = document.getElementById('htbFallback');

  try {
    const res = await fetch('/.netlify/functions/htb');
    const payload = await res.json().catch(() => null);
    if (!res.ok || !payload || !payload.ok || !payload.data) {
      throw new Error((payload && payload.error) || `status ${res.status}`);
    }

    const data = payload.data;
    writeHTBCache(data);
    showHTB(renderHTBLive(data));
    updateAchieveDetail(data);
    updateRankStat(data.ranking);
  } catch {
    // Live fetch failed — fall back to the last successful response, if any
    const cached = readHTBCache();
    if (cached) {
      const when = new Date(cached.ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      showHTB(
        renderHTBLive(cached.data) +
        `<div class="htb-state htb-cached-note">
           <i class="fas fa-clock-rotate-left"></i>
           <span>Live stats unavailable — showing cached data from ${when}.</span>
         </div>`
      );
      updateAchieveDetail(cached.data);
      updateRankStat(cached.data.ranking);
      return;
    }
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

    const total = (data.coursera || []).length + (data.ncsa || []).length + (data.workshop || []).length;
    const certStat = document.getElementById('statCertCount');
    if (certStat) certStat.textContent = total;
  } catch {
    ['courseraGrid','ncsaGrid'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = `<p style="color:var(--muted);font-size:.88rem">Could not load certificates.</p>`;
    });
  }
}

/* ── Certificate tabs ───────────────────────────────────── */
const certTabs = Array.from(document.querySelectorAll('.cert-tab'));

function activateCertTab(tab) {
  certTabs.forEach(t => {
    const selected = t === tab;
    t.classList.toggle('active', selected);
    t.setAttribute('aria-selected', String(selected));
    t.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(`panel-${t.dataset.tab}`);
    if (panel) {
      panel.classList.toggle('active', selected);
      panel.hidden = !selected;
    }
  });
}

certTabs.forEach(tab => {
  tab.addEventListener('click', () => activateCertTab(tab));
  tab.addEventListener('keydown', e => {
    const i = certTabs.indexOf(tab);
    let next = null;
    if (e.key === 'ArrowRight')      next = certTabs[(i + 1) % certTabs.length];
    else if (e.key === 'ArrowLeft')  next = certTabs[(i - 1 + certTabs.length) % certTabs.length];
    else if (e.key === 'Home')       next = certTabs[0];
    else if (e.key === 'End')        next = certTabs[certTabs.length - 1];
    if (next) {
      e.preventDefault();
      activateCertTab(next);
      next.focus();
    }
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
