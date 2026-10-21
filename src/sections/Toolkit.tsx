const GROUPS: { label: string; rows: [string, string][] }[] = [
  {
    label: 'Attack',
    rows: [
      ['Burp Suite', 'web exploitation'],
      ['Kali Linux', 'offensive distro'],
      ['Nmap', 'network discovery'],
      ['Wireshark', 'packet analysis'],
    ],
  },
  {
    label: 'Defend',
    rows: [
      ['Splunk', 'SIEM, detection rules'],
      ['ELK', 'dashboards, monitoring'],
      ['Log analysis', 'AWS WAF, CloudFront'],
      ['Malware behaviour analysis', 'lab conditions'],
    ],
  },
  {
    label: 'Build',
    rows: [
      ['Python', 'scripting, tooling'],
      ['JavaScript', 'web'],
      ['C · Java · Go · SQL', 'fundamentals'],
      ['Docker · AWS · Git · Ubuntu', 'platforms'],
    ],
  },
]

const DOTS = ['t-dot', 't-dot t-dot--ink', 't-dot t-dot--surface']

export default function Toolkit() {
  return (
    <section className="section toolkit" aria-label="Toolkit">
      <h2 className="section-heading" data-reveal>
        Tools I reach for
      </h2>
      {GROUPS.map((g, gi) => (
        <div className="toolkit-group" key={g.label} data-reveal>
          <span>{g.label}</span>
          {g.rows.map(([name, val]) => (
            <div className="toolkit-row" key={name}>
              <span className="t-left">
                <i className={DOTS[gi]} aria-hidden="true" />
                {name}
              </span>
              <span className="t-val">{val}</span>
            </div>
          ))}
        </div>
      ))}
    </section>
  )
}
