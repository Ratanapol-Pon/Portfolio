export default function Contact() {
  return (
    <section className="section contact" id="contact" aria-label="Contact">
      <p className="contact-sentence" data-reveal>
        Open to security internships, SOC and junior penetration-testing roles, and research
        collaboration.
      </p>
      <div className="contact-photo" data-reveal>
        <img
          src="/assets/bangkok-night.jpg"
          alt="Bangkok's skyline at night, lit towers under a dark sky"
          width={1920}
          height={1440}
          loading="lazy"
        />
      </div>
      <div className="contact-links" data-reveal>
        <p className="c-q">Have a network worth watching?</p>
        <a href="mailto:RatChng@hotmail.com?subject=Security%20role%20or%20research%20—%20let's%20talk">
          RatChng@hotmail.com
        </a>
        <a href="https://www.linkedin.com/in/rattanapol" target="_blank" rel="noreferrer">
          linkedin.com/in/rattanapol
        </a>
        <p className="c-city">Bangkok, Thailand · usually replies within a day</p>
      </div>
    </section>
  )
}
