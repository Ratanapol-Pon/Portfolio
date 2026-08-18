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

Certificates are listed separately in **`certs.json`** (Coursera / NCSA /
workshops tabs) and are merged in at runtime. The certifications count stat
is computed automatically from `certs.json`.

Search the repo for `{{PLACEHOLDER}}` / `TODO` comments for values that
still need to be filled in (e.g. the deployed site URL in the meta tags and
`sitemap.xml`, and the senior-project publication status).
