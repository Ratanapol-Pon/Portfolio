# Rattanapol Chongchirakitkul — Personal Portfolio

Personal portfolio site for Rattanapol Chongchirakitkul, a cybersecurity
professional working in business development at JasTel Network Co., Ltd.
Highlights hands-on offensive security work (CTF competitions, HackTheBox,
RAT research) and defensive experience (Splunk SIEM, ELK, AWS log analysis).

## Tech stack

- Vanilla HTML / CSS / JS — no framework, no build step
- [Netlify](https://www.netlify.com/) hosting
- One Netlify serverless function (`netlify/functions/htb.js`) that proxies
  the HackTheBox API v4 to show live profile stats
- Google Analytics (GA4)
- Font Awesome + Google Fonts via CDN (pinned versions)

## Seasonal atmosphere

The visual theme follows the current date in Japan (`Asia/Tokyo`) and uses
five atmosphere modes: spring (Mar–May), rainy season (Jun–15 Jul), summer
(16 Jul–Aug), autumn (Sep–Nov), and winter (Dec–Feb). Each mode has its own
palette, ambient particles, and code-native pixel mascot. Visitors can pause
the decorative motion through their system reduced-motion setting, which is
respected automatically. Season selection runs in the background without a
visible status card.

For visual QA, append `?season=spring`, `?season=rainy`, `?season=summer`,
`?season=autumn`, or `?season=winter` to preview a mode without changing the
real date-driven default.

## Signal Trace story experience

The portfolio is organized as a seven-chapter professional journey: Origin,
Explore, Build, Bridge, Proof, Next, and Connect. A fixed progress rail links
the chapters on wide screens, while the compact navigation keeps the same
story order on smaller devices. Project entries are interactive case files
with challenge, action, evidence, and outcome fields stored in `content.json`.

Motion remains progressive enhancement: normal document scrolling, keyboard
controls, and `prefers-reduced-motion` support work without the cinematic
effects.

## Local development

Requires Node.js, then:

```bash
npx netlify dev
```

This serves the site locally and runs the serverless function, so the live
HackTheBox card works exactly as in production.

> The HTB function needs an app token. Set `HTB_APP_TOKEN` in a local `.env`
> file (or in the Netlify UI for production). Without it the site still
> renders — the HTB card falls back to cached/static content.

You can also open `index.html` directly or use any static server
(e.g. `npx serve .`) — everything except the live HTB fetch will work.

## Deployment

The site auto-deploys from the connected Git branch on Netlify.
`netlify.toml` contains only an SPA-style fallback redirect.

Required environment variable in Netlify (**Site settings → Environment
variables**):

| Variable        | Purpose                          |
| --------------- | -------------------------------- |
| `HTB_APP_TOKEN` | HackTheBox app API token (Bearer) |

## Updating content

Almost all text content lives in **`content.json`** — hero bio, about
paragraphs, stats, experience entries, projects, achievements, education,
contact info, and the footer "Last updated" date. Edit that one file and
commit; no HTML changes needed.

Certificates are listed separately in **`certs.json`** (NCSA / security vendor /
courses and workshops tabs) and are merged in at runtime. The certifications count stat
is computed automatically from `certs.json`.

The senior-project badge in `content.json` (`projects[1].badge`) tracks the
AINTEC 2026 publication status — update it as the status changes (e.g.
"Accepted", "Presented", "Published").
