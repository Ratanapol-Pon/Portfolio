import { useState } from 'react'

/* ---- the four attack classes of the senior project, shown from both sides ---- */

const EVENTS = [
  {
    id: 'phishing',
    label: 'Phishing',
    trace: `10:41:07  smtp   mail from support@secure-7l1ne-th.com
10:41:52  http   GET /thaipost-verify.login-example
10:42:31  http   POST /auth  user=somchai.k pass=••••••
10:42:33  dns    query cdn-static-metrics.io (registered 2 days ago)`,
    severity: 'High · 8',
    catch:
      'Credential submission to a newly registered look-alike domain. The alert went out over LINE and email with the session’s event history attached, ready for analyst handoff.',
  },
  {
    id: 'dos',
    label: 'Denial of service',
    trace: `11:03:12  fw     SYN 45.155.x.x → web-01:443
11:03:12  fw     SYN 91.240.x.x → web-01:443
11:03:13  fw     38,400 SYN/s from 1,200 unique sources
11:03:40  svc    http latency 120ms → 4.8s`,
    severity: 'Critical · 9',
    catch:
      'A SYN flood pattern: 38k packets a second across 1,200 sources against one host. The rate-based rule tripped within 30 seconds and shipped the top talkers with the last hour’s baseline.',
  },
  {
    id: 'cryptojacking',
    label: 'Cryptojacking',
    trace: `22:14:02  edr    proc /tmp/.x11-cache started by www-data
22:14:09  net    stratum+tcp → pool.minexx.example:3333
22:15:00  mon    cpu 98% sustained, load 12.4
22:20:00  net    6 MB out / 0.4 MB in, regular 10s beats`,
    severity: 'Medium · 6',
    catch:
      'Mining-pool traffic on the stratum protocol plus sustained CPU on a web server. Process, network and telemetry correlated into one alert instead of three separate ones.',
  },
  {
    id: 'bruteforce',
    label: 'Brute force',
    trace: `03:12:44  sshd   Failed password for admin from 185.220.x.x
03:14:57  sshd   412 failures, 9 accounts, 1 source
03:15:31  sshd   Accepted password for ops from 185.220.x.x
03:15:33  os     new session, TTY allocated`,
    severity: 'High · 7',
    catch:
      '412 failures followed by one success from the same source. The success raises the severity, and the alert carries the full attempt series so containment can start immediately.',
  },
] as const

type EventId = (typeof EVENTS)[number]['id']

/* ---- ledger rows with their previews ---- */

function SplunkFrag() {
  return (
    <div className="frag" data-ui>
      <div className="frag-title">
        <span>Splunk · anomaly alerts</span>
        <span className="frag-tag">real-time</span>
      </div>
      <div>
        <span className="sev">Critical · 9</span>{' '}
        <span className="frag-note">DoS on web-01, tripped in 30s</span>
      </div>
      <div className="frag-bars" aria-hidden="true">
        {[3, 4, 3, 5, 4, 6, 5, 7, 6, 5, 9, 13, 18, 11, 7, 5, 4, 4].map((h, i) => (
          <i key={i} className={h >= 13 ? 'hot' : ''} style={{ height: `${h * 5.2}%` }} />
        ))}
      </div>
      <div className="frag-note">Events per hour · LINE + SMTP alerting, severity scored</div>
    </div>
  )
}

function C2Frag() {
  return (
    <div className="frag" data-ui>
      <div className="frag-title">
        <span>C2 channel · beacon analysis</span>
        <span className="frag-tag">lab capture</span>
      </div>
      <pre>{`beacon 60.0s  jitter 0%   GET /news/rss
beacon 60.1s  jitter 0%   GET /news/rss
task   reg add ...\\Run /v upd /t REG_SZ
exfil  4.2 MB → 45.155.x.x over 9 sessions`}</pre>
      <div className="frag-note">Fixed-interval beaconing: the pattern the detection signature keys on</div>
    </div>
  )
}

function ElkFrag() {
  return (
    <div className="frag" data-ui>
      <div className="frag-title">
        <span>ELK · store network status</span>
        <span className="frag-tag">nationwide</span>
      </div>
      <div className="frag-bars" aria-hidden="true">
        {[8, 9, 9, 10, 9, 11, 10, 12, 14, 13, 12, 15, 13, 12, 11, 10, 9, 9].map((h, i) => (
          <i key={i} className={h >= 14 ? 'hot' : ''} style={{ height: `${h * 5.4}%` }} />
        ))}
      </div>
      <div className="frag-note">AWS WAF + CloudFront log analysis across the production environment</div>
    </div>
  )
}

const ROWS: {
  name: string
  kind: string
  year: string
  preview: 'splunk' | 'c2' | 'elk' | string
}[] = [
  { name: 'Anomaly detection on Splunk', kind: 'Senior project', year: '2025–26', preview: 'splunk' },
  { name: 'Remote access trojan investigation', kind: 'Offensive research', year: '2025', preview: 'c2' },
  { name: 'Network & security internship', kind: 'Gosoft, enterprise defence', year: '2025', preview: 'elk' },
  { name: 'IT audit lecturer assistant', kind: 'Mahidol University', year: '2026', preview: '/assets/detail-1.jpg' },
  { name: 'Python lecturer assistant', kind: 'Mahidol University', year: '2024', preview: '/assets/hero-2.jpg' },
  { name: 'HackTheBox Academy', kind: 'Self-directed practice', year: 'ongoing', preview: '/assets/hero-3.jpg' },
]

function Preview({ kind }: { kind: string }) {
  if (kind === 'splunk') return <SplunkFrag />
  if (kind === 'c2') return <C2Frag />
  if (kind === 'elk') return <ElkFrag />
  return <img src={kind} alt="" loading="lazy" />
}

export default function Work() {
  const [active, setActive] = useState<{ i: number; top: number } | null>(null)
  const [eventId, setEventId] = useState<EventId>('phishing')
  const ev = EVENTS.find((e) => e.id === eventId)!

  const showPreview = (e: React.SyntheticEvent<HTMLElement>, i: number) => {
    const rowEl = e.currentTarget
    const ledger = rowEl.closest('.work-ledger') as HTMLElement
    const top =
      rowEl.getBoundingClientRect().top -
      ledger.getBoundingClientRect().top +
      ledger.scrollTop
    setActive({ i, top })
  }

  return (
    <section className="section" id="work" aria-label="Selected work">
      <div className="work-ledger" data-reveal-group>
        <h2 className="section-heading" data-reveal>
          Both sides
        </h2>
        <div onMouseLeave={() => setActive(null)}>
          {ROWS.map((row, i) => (
            <div key={row.name} data-reveal>
              {i < 3 && (
                <div className="ledger-frag-mobile">
                  <Preview kind={row.preview} />
                </div>
              )}
              <div
                className="ledger-row"
                onMouseEnter={(e) => showPreview(e, i)}
                onFocus={(e) => showPreview(e, i)}
              >
                <span>{row.name}</span>
                <span className="ledger-kind">{row.kind}</span>
                <span className="ledger-year">{row.year}</span>
              </div>
            </div>
          ))}
          <div
            className={`ledger-preview${active ? ' is-on' : ''}`}
            style={active ? { top: active.top } : undefined}
            aria-hidden="true"
          >
            {active && <Preview kind={ROWS[active.i].preview} />}
          </div>
        </div>
      </div>

      <div className="event">
        <div className="event-inner">
          <h3 data-reveal>One event, two views</h3>
          <p className="event-lead" data-reveal>
            Pick one of the four attack classes my senior project detects. The left pane is what the
            attacker’s side leaves behind; the right is what the system makes of it.
          </p>
          <div className="event-picks" data-reveal role="group" aria-label="Choose an attack class">
            {EVENTS.map((e) => (
              <button
                key={e.id}
                aria-pressed={e.id === eventId}
                onClick={() => setEventId(e.id)}
              >
                {e.label}
              </button>
            ))}
          </div>
          <div className="event-panes">
            <div className="event-pane" data-reveal>
              <h4>The trace</h4>
              <pre className="event-swap" key={`t-${ev.id}`}>
                <code>{ev.trace}</code>
              </pre>
            </div>
            <div className="event-pane" data-reveal>
              <h4>The catch</h4>
              <div className="catch event-swap" key={`c-${ev.id}`}>
                <span className="catch-sev">{ev.severity}</span>
                <p>{ev.catch}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
