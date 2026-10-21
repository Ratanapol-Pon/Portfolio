export default function Letter() {
  return (
    <section className="letter" id="letter" aria-label="A letter from Rattanapol">
      <div className="letter-mark" aria-hidden="true" data-reveal>
        R
      </div>
      <div data-reveal>
        <p>
          Most people in security pick a side early. I got interested in the space between them.
          Building a remote access trojan in a lab taught me what an attacker hopes you'll never
          notice — and catching that same traffic taught me what a defender has to work with.
        </p>
        <p>
          The two projects inform each other on purpose. Every persistence trick I ran became a
          detection signature; every false positive in my Splunk rules sent me back to the lab to
          understand what normal actually looks like.
        </p>
        <p>
          Teaching has shaped how I write. Grading Python assignments and reviewing seniors' lab
          work for mixed-ability audiences is, in the end, the same job as{' '}
          <mark>writing a findings report a non-technical manager can act on</mark>.
        </p>
        <p>
          I graduate in 2026. Until then: HackTheBox modules, CTF weekends, and OSCP preparation.
          If you're building a SOC team or a research group in Bangkok, I'd like to talk.
        </p>
        <p className="letter-sign">Rattanapol</p>
        <p className="letter-role">Final-year ICT student, Mahidol University</p>
      </div>
    </section>
  )
}
