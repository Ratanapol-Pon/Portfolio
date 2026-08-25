/* ════════════════════════════════════════════════════════════
   Content loading — content.json is the single source of truth.
   Last successful copy is cached in localStorage so the site
   still renders when network calls fail.
   ════════════════════════════════════════════════════════════ */
/* Seasonal atmosphere: driven by the current calendar date in Japan. */
const SEASONS = {
  spring: {
    themeColor: '#fff6f4',
    particleCount: 32,
    duration: [9, 16],
    size: [5, 9],
    mascot: `
      <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="57" width="52" height="3" fill="#cf8fa4" opacity=".45"/>
        <rect x="19" y="7" width="8" height="24" fill="#f2bdca"/>
        <rect x="37" y="7" width="8" height="24" fill="#f2bdca"/>
        <rect x="21" y="10" width="4" height="16" fill="#d87998"/>
        <rect x="39" y="10" width="4" height="16" fill="#d87998"/>
        <rect x="15" y="25" width="34" height="25" fill="#f7d7df"/>
        <rect x="11" y="31" width="42" height="13" fill="#f7d7df"/>
        <rect x="19" y="50" width="26" height="7" fill="#f2bdca"/>
        <rect x="21" y="32" width="5" height="5" fill="#43323a"/>
        <rect x="38" y="32" width="5" height="5" fill="#43323a"/>
        <rect x="29" y="39" width="6" height="4" fill="#c95f82"/>
        <rect x="26" y="45" width="5" height="3" fill="#a95570"/>
        <rect x="33" y="45" width="5" height="3" fill="#a95570"/>
        <rect x="48" y="18" width="5" height="5" fill="#e882a2"/>
        <rect x="53" y="13" width="5" height="5" fill="#f1adc0"/>
        <rect x="53" y="23" width="5" height="5" fill="#f1adc0"/>
        <rect x="58" y="18" width="5" height="5" fill="#e882a2"/>
      </svg>`
  },
  rainy: {
    themeColor: '#eaf1f3',
    particleCount: 52,
    duration: [0.65, 1.05],
    size: [4, 7],
    mascot: `
      <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="57" width="54" height="3" fill="#4e8395" opacity=".45"/>
        <rect x="9" y="12" width="46" height="6" fill="#5e8c50"/>
        <rect x="15" y="7" width="34" height="6" fill="#75a35f"/>
        <rect x="23" y="4" width="18" height="4" fill="#8eb576"/>
        <rect x="31" y="15" width="3" height="21" fill="#355b48"/>
        <rect x="17" y="27" width="11" height="11" fill="#94bc64"/>
        <rect x="36" y="27" width="11" height="11" fill="#94bc64"/>
        <rect x="21" y="32" width="22" height="20" fill="#83ad55"/>
        <rect x="16" y="37" width="32" height="11" fill="#83ad55"/>
        <rect x="20" y="26" width="5" height="5" fill="#edf5d7"/>
        <rect x="39" y="26" width="5" height="5" fill="#edf5d7"/>
        <rect x="21" y="28" width="3" height="3" fill="#24372d"/>
        <rect x="40" y="28" width="3" height="3" fill="#24372d"/>
        <rect x="26" y="39" width="4" height="3" fill="#314b3a"/>
        <rect x="34" y="39" width="4" height="3" fill="#314b3a"/>
        <rect x="27" y="45" width="10" height="3" fill="#cf6d7d"/>
        <rect x="18" y="51" width="12" height="7" fill="#e1b932"/>
        <rect x="35" y="51" width="12" height="7" fill="#e1b932"/>
      </svg>`
  },
  summer: {
    themeColor: '#fff8df',
    particleCount: 22,
    duration: [3.5, 7],
    size: [3, 5],
    mascot: `
      <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="30" width="41" height="12" fill="#f7faf8"/>
        <rect x="14" y="25" width="31" height="21" fill="#f7faf8"/>
        <rect x="39" y="26" width="14" height="14" fill="#f7faf8"/>
        <rect x="49" y="31" width="9" height="5" fill="#e6a52e"/>
        <rect x="55" y="33" width="7" height="3" fill="#d06b22"/>
        <rect x="44" y="29" width="4" height="4" fill="#263942"/>
        <g class="bird-wing">
          <rect x="19" y="18" width="8" height="14" fill="#d7e1e1"/>
          <rect x="25" y="13" width="8" height="17" fill="#f7faf8"/>
          <rect x="31" y="17" width="8" height="13" fill="#d7e1e1"/>
        </g>
        <rect x="5" y="35" width="10" height="6" fill="#d7e1e1"/>
        <rect x="1" y="38" width="9" height="4" fill="#f7faf8"/>
        <rect x="20" y="43" width="18" height="5" fill="#d7e1e1"/>
        <rect x="8" y="10" width="4" height="4" fill="#ffd95b"/>
        <rect x="12" y="6" width="4" height="4" fill="#ffd95b"/>
      </svg>`
  },
  autumn: {
    themeColor: '#f6ebd9',
    particleCount: 34,
    duration: [10, 18],
    size: [6, 10],
    mascot: `
      <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="57" width="54" height="3" fill="#a6532d" opacity=".45"/>
        <rect x="13" y="13" width="10" height="17" fill="#b84e25"/>
        <rect x="41" y="13" width="10" height="17" fill="#b84e25"/>
        <rect x="17" y="20" width="30" height="27" fill="#d8662e"/>
        <rect x="12" y="27" width="40" height="13" fill="#d8662e"/>
        <rect x="20" y="27" width="6" height="5" fill="#2e2822"/>
        <rect x="38" y="27" width="6" height="5" fill="#2e2822"/>
        <rect x="25" y="35" width="14" height="9" fill="#f0d2a4"/>
        <rect x="30" y="35" width="5" height="4" fill="#3c2d26"/>
        <rect x="22" y="46" width="22" height="11" fill="#bd5128"/>
        <rect x="45" y="43" width="11" height="12" fill="#d8662e"/>
        <rect x="52" y="38" width="8" height="15" fill="#d8662e"/>
        <rect x="57" y="35" width="5" height="11" fill="#f1d3a6"/>
        <rect x="2" y="35" width="7" height="7" fill="#a13e20"/>
        <rect x="5" y="31" width="3" height="14" fill="#704123"/>
      </svg>`
  },
  winter: {
    themeColor: '#edf5f8',
    particleCount: 42,
    duration: [9, 18],
    size: [3, 8],
    mascot: `
      <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="57" width="56" height="4" fill="#b8d5e4"/>
        <rect x="17" y="37" width="30" height="20" fill="#f8fcfd"/>
        <rect x="12" y="43" width="40" height="10" fill="#f8fcfd"/>
        <rect x="21" y="20" width="22" height="22" fill="#f8fcfd"/>
        <rect x="17" y="25" width="30" height="12" fill="#f8fcfd"/>
        <rect x="21" y="15" width="22" height="6" fill="#324a58"/>
        <rect x="25" y="7" width="16" height="9" fill="#324a58"/>
        <rect x="24" y="27" width="4" height="4" fill="#263943"/>
        <rect x="37" y="27" width="4" height="4" fill="#263943"/>
        <rect x="29" y="33" width="5" height="4" fill="#e77a34"/>
        <rect x="23" y="38" width="20" height="5" fill="#4b83a5"/>
        <rect x="38" y="42" width="6" height="11" fill="#4b83a5"/>
        <rect x="30" y="46" width="5" height="5" fill="#49616e"/>
        <rect x="8" y="38" width="10" height="3" fill="#6f5140"/>
        <rect x="46" y="38" width="10" height="3" fill="#6f5140"/>
      </svg>`
  }
};

function getJapanDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }).formatToParts(date);
  return Object.fromEntries(parts.filter(p => p.type !== 'literal').map(p => [p.type, Number(p.value)]));
}

function getJapanSeason(month, day) {
  if (month >= 3 && month <= 5) return 'spring';
  if (month === 6 || (month === 7 && day <= 15)) return 'rainy';
  if ((month === 7 && day >= 16) || month === 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

function seededRandom(seedText) {
  let seed = Array.from(seedText).reduce((value, char) => value + char.charCodeAt(0), 0) || 1;
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function renderSeasonParticles(seasonKey) {
  const layer = document.getElementById('seasonParticles');
  const season = SEASONS[seasonKey];
  if (!layer || !season) return;

  const random = seededRandom(seasonKey);
  const mobileFactor = window.matchMedia('(max-width: 600px)').matches ? 0.7 : 1;
  const count = Math.round(season.particleCount * mobileFactor);
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i += 1) {
    const particle = document.createElement('span');
    const duration = season.duration[0] + random() * (season.duration[1] - season.duration[0]);
    const size = season.size[0] + random() * (season.size[1] - season.size[0]);
    particle.className = 'season-particle';
    particle.style.setProperty('--x', (random() * 100).toFixed(2));
    particle.style.setProperty('--y', (10 + random() * 80).toFixed(2));
    particle.style.setProperty('--size', `${size.toFixed(1)}px`);
    particle.style.setProperty('--drift', `${(-45 + random() * 90).toFixed(1)}px`);
    particle.style.setProperty('--duration', `${duration.toFixed(2)}s`);
    particle.style.setProperty('--delay', `${(-random() * duration).toFixed(2)}s`);
    particle.style.setProperty('--opacity', (0.35 + random() * 0.45).toFixed(2));
    fragment.appendChild(particle);
  }

  layer.replaceChildren(fragment);
}

function applySeason(seasonKey) {
  const season = SEASONS[seasonKey];
  if (!season) return;

  document.body.dataset.season = seasonKey;
  document.getElementById('seasonMascot').innerHTML = season.mascot;

  const themeMeta = document.getElementById('themeColor');
  if (themeMeta) themeMeta.setAttribute('content', season.themeColor);
  renderSeasonParticles(seasonKey);
}

function initSeason() {
  const now = new Date();
  const japanDate = getJapanDateParts(now);
  const requestedSeason = new URLSearchParams(window.location.search).get('season');
  const previewSeason = requestedSeason && SEASONS[requestedSeason] ? requestedSeason : null;
  const seasonKey = previewSeason || getJapanSeason(japanDate.month, japanDate.day);
  applySeason(seasonKey);
}

initSeason();

const CONTENT_CACHE_KEY = 'contentCacheV1';

async function loadContent() {
  try {
    const res = await fetch('/content.json');
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = await res.json();
    try { localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify(data)); } catch { /* storage unavailable */ }
    return data;
  } catch {
    try {
      const cached = JSON.parse(localStorage.getItem(CONTENT_CACHE_KEY) || 'null');
      if (cached) return cached;
    } catch { /* corrupted cache */ }
    return null;
  }
}

/* ── Renderers ────────────────────────────────────────────── */
function renderContent(c) {
  // Hero
  const heroBio = document.getElementById('heroBio');
  if (heroBio && c.hero?.bioHtml) heroBio.innerHTML = c.hero.bioHtml;

  const heroCta = document.getElementById('heroCta');
  if (heroCta && c.hero?.cta) {
    heroCta.innerHTML = c.hero.cta.map(b => `
      <a href="${b.url}" class="btn ${b.class || 'btn-outline'}" target="_blank" rel="noopener">
        <i class="${b.icon}" aria-hidden="true"></i> ${b.label}
      </a>`).join('');
  }

  // About
  const aboutBio = document.getElementById('aboutBio');
  if (aboutBio && c.about?.paragraphsHtml) {
    aboutBio.innerHTML = c.about.paragraphsHtml.map(p => `<p>${p}</p>`).join('');
  }

  // Stats
  const statsRow = document.getElementById('statsRow');
  if (statsRow && c.stats) {
    statsRow.innerHTML = c.stats.map(s => `
      <div class="stat-item">
        <div class="stat-val ${s.valueClass || ''}"${s.id ? ` id="${s.id}"` : ''}>${s.value}</div>
        <div class="stat-label">${s.labelHtml}</div>
      </div>`).join('');
  }

  // Experience
  const timeline = document.getElementById('timeline');
  if (timeline && c.experience) {
    timeline.innerHTML = c.experience.map(e => `
      <div class="tl-item">
        <div class="tl-dot"></div>
        <div class="card tl-card">
          <div class="tl-header">
            <div>
              <h3>${e.title}${e.current ? ' <span class="badge badge-current">Current</span>' : ''}</h3>
              <span class="company">${e.company}</span>
            </div>
            <span class="period">${e.period}</span>
          </div>
          <ul class="tl-points">
            ${(e.pointsHtml || []).map(p => `<li>${p}</li>`).join('')}
          </ul>
        </div>
      </div>`).join('');
  }

  // Projects
  const projectsGrid = document.getElementById('projectsGrid');
  if (projectsGrid && c.projects) {
    projectsGrid.innerHTML = c.projects.map(p => `
      <div class="card project-card">
        <div class="project-top">
          <span class="project-type">${p.type}</span>
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
        </div>
        <h3>${p.title}</h3>
        <p>${p.bodyHtml}</p>
        <div class="tags">${(p.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</div>
      </div>`).join('');
  }

  // Achievements
  const achieveGrid = document.getElementById('achieveGrid');
  if (achieveGrid && c.achievements) {
    achieveGrid.innerHTML = c.achievements.map(g => `
      <div class="card achieve-card">
        <h3><i class="${g.icon}" aria-hidden="true"></i> ${g.title}</h3>
        <div class="achieve-list">
          ${(g.items || []).map(item => `
            <div class="achieve-item">
              <div class="achieve-name">${item.name}</div>
              <div class="achieve-detail"${item.detailId ? ` id="${item.detailId}"` : ''}>${item.detail}</div>
              ${item.tags ? `<div class="tags mt-4">${item.tags.map(t => `<span class="tag sm">${t}</span>`).join('')}</div>` : ''}
            </div>`).join('')}
        </div>
      </div>`).join('');
  }

  // Education
  const eduBody = document.getElementById('eduBody');
  if (eduBody && c.education) {
    const e = c.education;
    eduBody.innerHTML = `
      <h3>${e.school}</h3>
      <p class="edu-degree">${e.degree}</p>
      <p class="edu-major">${e.major}</p>
      <div class="edu-meta">
        ${(e.meta || []).map(m => `<span><i class="${m.icon}" aria-hidden="true"></i> ${m.text}</span>`).join('')}
      </div>
      <div class="tags">${(e.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</div>`;
  }

  // Contact
  const contactSub = document.getElementById('contactSub');
  if (contactSub && c.contact?.subtitle) contactSub.textContent = c.contact.subtitle;

  const contactGrid = document.getElementById('contactGrid');
  if (contactGrid && c.contact?.cards) {
    contactGrid.innerHTML = c.contact.cards.map(card => {
      const inner = `
        <i class="${card.icon}" aria-hidden="true"></i>
        <h3>${card.title}</h3>
        <p>${card.text}</p>`;
      return card.href
        ? `<a href="${card.href}" class="card contact-card"${card.href.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${inner}</a>`
        : `<div class="card contact-card static">${inner}</div>`;
    }).join('');
  }

  // Footer — last updated
  if (c.lastUpdated) {
    const lu = document.getElementById('lastUpdated');
    if (lu) lu.textContent = c.lastUpdated;
  }
}

/* ── Navbar scroll + active link ─────────────────────────── */
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');

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

function initReveal() {
  document.querySelectorAll(
    '.card, .section-title, .section-sub, .tl-item, .hero-inner > *'
  ).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 5) * 0.07}s`;
    observer.observe(el);
  });
}

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

/* ── HackTheBox live data (with localStorage fallback) ──── */
const HTB_CACHE_KEY = 'htbCacheV1';

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
    : `<div class="htb-avatar-box"><i class="fas fa-cube htb-cube-icon" aria-hidden="true"></i></div>`;

  return `
    <div class="htb-header">
      ${avatar}
      <div class="htb-header-info">
        <h3 class="htb-name">${d.name}</h3>
        <div class="htb-meta">
          <span class="htb-rank-badge ${rankClass(d.rank)}">${d.rank || 'Noob'}</span>
          ${d.country ? `<span class="htb-loc"><i class="fas fa-location-dot" aria-hidden="true"></i> ${d.country}</span>` : ''}
        </div>
      </div>
      <a href="https://app.hackthebox.com/profile/${d.id}" class="btn btn-htb" target="_blank" rel="noopener">
        <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i> View Profile
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
           <i class="fas fa-clock-rotate-left" aria-hidden="true"></i>
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
  if (low.includes('google'))  return '<i class="fab fa-google" aria-hidden="true"></i>';
  if (low.includes('ncsa') || low.includes('mooc')) return '<i class="fas fa-shield-halved" aria-hidden="true"></i>';
  if (low.includes('fortinet')) return '<i class="fas fa-network-wired" aria-hidden="true"></i>';
  if (low.includes('sentinelone')) return '<i class="fas fa-eye" aria-hidden="true"></i>';
  if (low.includes('nsrc') || low.includes('kasetsart') || low.includes('thairen')) return '<i class="fas fa-cloud" aria-hidden="true"></i>';
  return '<i class="fas fa-graduation-cap" aria-hidden="true"></i>';
}

function renderCertCard(c) {
  const iconClass = certPlatformIcon(c.issuer);
  const iconLabel = certPlatformLabel(c.issuer);
  const grade  = c.grade    ? `<div class="cert-grade"><i class="fas fa-star" aria-hidden="true"></i> ${c.grade}${c.hours ? ' &nbsp;·&nbsp; ' + c.hours : ''}</div>` : '';
  const certId = c.cert_id  ? `<div class="cert-id"><i class="fas fa-fingerprint" aria-hidden="true"></i> ${c.cert_id}</div>` : '';
  const tags   = (c.skills || []).map(s => `<span class="tag sm">${s}</span>`).join('');
  const details = [c.date, c.platform].filter(Boolean).join(' · ');

  return `
    <div class="cert-card reveal">
      <div class="cert-card-top">
        <div class="cert-platform-icon ${iconClass}">${iconLabel}</div>
        <div class="cert-meta">
          <span class="cert-issuer">${c.issuer}</span>
          ${details ? `<span class="cert-date">${details}</span>` : ''}
        </div>
      </div>
      <h4 class="cert-title">${c.title}</h4>
      ${grade}
      ${certId}
      <div class="tags">${tags}</div>
      ${c.link ? `<a href="${c.link}" class="cert-btn" target="_blank" rel="noopener"><i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i> Verify Certificate</a>` : ''}
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
    populateGrid(data.ncsa        || [], 'ncsaGrid',        'ncsaCount');
    populateGrid(data.fortinet    || [], 'fortinetGrid',    'fortinetCount');
    populateGrid(data.sentinelone || [], 'sentineloneGrid', 'sentineloneCount');

    const total = (data.ncsa || []).length + (data.fortinet || []).length + (data.sentinelone || []).length;
    const certStat = document.getElementById('statCertCount');
    if (certStat) certStat.textContent = total;
  } catch {
    ['ncsaGrid', 'fortinetGrid', 'sentineloneGrid'].forEach(id => {
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

/* ── Init: render content, then start async loads ───────── */
(async function init() {
  const content = await loadContent();
  if (content) {
    renderContent(content);
  } else {
    const heroBio = document.getElementById('heroBio');
    if (heroBio) {
      heroBio.textContent = 'Content could not be loaded — please check your connection and reload the page.';
    }
  }

  initReveal();
  loadHTB();
  loadCerts();
})();
