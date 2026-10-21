import { Fragment } from 'react'

const GROUPS: { year: string; rows: [string, string, string][] }[] = [
  {
    year: '2026',
    rows: [
      ['ARCHA CTF 2026 (DropCTF)', 'National competition, 244 teams', '60th place'],
      ['Manuscript, IAIT 2026', 'Int. Conference on Advances in IT', 'In preparation'],
      ['IT audit lecturer assistant', 'Mahidol University', 'Mar – Apr 2026'],
    ],
  },
  {
    year: '2025',
    rows: [
      ['Thailand Cyber Top Talent', 'National Cyber Security Agency', 'Web & forensics, team of three'],
      ['STDiO CTF 2025', '2600 Thailand', 'Offensive security, team of three'],
      ['Basic Cybersecurity certificate', 'NCSA', 'Certified'],
    ],
  },
  {
    year: '2022 – 26',
    rows: [['B.Sc. ICT, Computer Network', 'Mahidol University, international program', 'GPAX 3.01']],
  },
]

export default function Proof() {
  return (
    <section className="section proof" aria-label="Competitions and recognition">
      <h2 className="section-heading" data-reveal>
        Competitions
        <span>and recognition</span>
      </h2>
      <table className="proof-table" data-reveal>
        <tbody>
          {GROUPS.map((g, gi) => (
            <Fragment key={g.year}>
              {gi > 0 && (
                <tr className="p-gap" aria-hidden="true">
                  <td colSpan={4}></td>
                </tr>
              )}
              {g.rows.map((r, ri) => (
                <tr key={r[0]}>
                  <td className="p-year">{ri === 0 ? g.year : ''}</td>
                  <td className="p-what">{r[0]}</td>
                  <td className="p-who">{r[1]}</td>
                  <td className="p-result">{r[2]}</td>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </section>
  )
}
