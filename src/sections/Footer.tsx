export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-line">
        <span>Security, both sides</span>
        <nav aria-label="Footer">
          <a href="mailto:RatChng@hotmail.com">Email</a>
          <a href="https://www.linkedin.com/in/rattanapol" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="#work">Work</a>
        </nav>
        <span className="f-right">© 2026</span>
      </div>
      <p className="footer-credits">
        Photographs: Luke Pamer, Patryk Sobczak, Danka &amp; Peter, Volkan Olmez, Joshua Earle
        (Unsplash licence, via Picsum). “Bangkok Skyline from Movenpick Hotel, Asok, Bangkok at
        night” by Slyronit,{' '}
        <a
          href="https://commons.wikimedia.org/w/index.php?curid=148665958"
          target="_blank"
          rel="noreferrer"
        >
          CC BY-SA 4.0
        </a>
        , via Wikimedia Commons. The figures seen from behind are atmosphere, not the author.
      </p>
    </footer>
  )
}
