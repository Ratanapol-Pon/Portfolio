export default function Intro() {
  return (
    <section className="section intro" aria-label="Introduction">
      <div className="intro-text">
        <p data-reveal>
          I'm a final-year ICT student at Mahidol University in Bangkok, majoring in computer
          networks. I work security from both directions: how attacks are built, and how they are
          caught.
        </p>
        <p data-reveal>
          In one research project I assembled an attacker–victim–C2 lab and ran a remote access
          trojan under controlled conditions, studying persistence, command traffic and
          exfiltration, then turned what I watched into detection signatures and prevention
          controls.
        </p>
        <p data-reveal>
          In my senior project I built the other half: a real-time anomaly detection and alerting
          system on Splunk's free license that catches phishing, denial-of-service, cryptojacking
          and brute-force attacks, scores their severity, and hands analysts the event history
          over LINE and email.
        </p>
        <p data-reveal>
          At Gosoft I analysed AWS WAF and CloudFront logs across a production environment and
          built ELK dashboards that watched the network status of 7-Eleven stores nationwide.
        </p>
        <p data-reveal>
          Off the clock I practise on HackTheBox and compete in CTFs while preparing for the OSCP.{' '}
          <a href="#contact">Get in touch</a>.
        </p>
      </div>
      <div className="intro-photo" data-reveal>
        <img
          src="/assets/intro-1.jpg"
          alt="A person standing on a wall, facing a blue lake and distant mountains"
          width={1200}
          height={1500}
          loading="lazy"
        />
      </div>
    </section>
  )
}
