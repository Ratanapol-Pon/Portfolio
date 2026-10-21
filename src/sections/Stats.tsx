const FIGURES: [string, string][] = [
  ['60th', 'national finish out of 244 teams at ARCHA CTF 2026'],
  ['4', 'attack classes my senior project detects, scores and alerts on'],
  ['2', 'research projects: one offensive, one defensive, by design'],
  ['6.5', 'IELTS score; findings reported in English and Thai'],
  ['3.01', 'GPAX, B.Sc. ICT (Computer Network), Mahidol University'],
]

export default function Stats() {
  return (
    <section className="section stats" aria-label="Figures">
      <h2 className="stats-head" data-reveal>
        The numbers so far
      </h2>
      <dl className="stats-rows">
        {FIGURES.map(([n, s]) => (
          <div className="stats-row" key={n + s} data-reveal>
            <dt>{n}</dt>
            <dd>{s}</dd>
          </div>
        ))}
      </dl>
      <div className="stats-photo" data-reveal>
        <img
          src="/assets/stats-1.jpg"
          alt="A person sitting on a rock, looking out over a sea of clouds"
          width={900}
          height={900}
          loading="lazy"
        />
      </div>
    </section>
  )
}
