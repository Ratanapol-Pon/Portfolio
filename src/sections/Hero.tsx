import { useEffect, useRef, useState } from 'react'

const HERO_SHOTS = ['/assets/hero-1.jpg', '/assets/hero-2.jpg', '/assets/hero-3.jpg']

export default function Hero() {
  const [shot, setShot] = useState(0)
  const [docked, setDocked] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const frame2Ref = useRef<HTMLDivElement>(null)
  const reduced = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  // signature move: the slow crossfade, paused when the tab is hidden
  useEffect(() => {
    if (reduced.current) return
    let timer: number | undefined
    const tick = () => setShot((s) => (s + 1) % HERO_SHOTS.length)
    const start = () => {
      window.clearInterval(timer)
      timer = window.setInterval(tick, 5500)
    }
    const onVis = () => (document.hidden ? window.clearInterval(timer) : start())
    start()
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  // the rail takes the page ground once the second picture has passed
  useEffect(() => {
    const onScroll = () => {
      const el = frame2Ref.current
      if (!el) return
      setDocked(el.getBoundingClientRect().bottom <= 64)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div className="hero-top">
        <div className="hero-frame hero-frame--first">
          <span aria-hidden="true">
            {HERO_SHOTS.map((src, i) => (
              <img key={src} src={src} alt="" className={i === shot ? 'is-showing' : ''} />
            ))}
          </span>
          <div className="hero-mobile-note">
            <p>Security, studied from both sides of the wire.</p>
            <a
              className="btn"
              href="mailto:RatChng@hotmail.com?subject=Hello%20from%20your%20portfolio"
            >
              Email me
            </a>
          </div>
        </div>
      </div>

      <div className={`rail${docked ? ' is-docked' : ''}`}>
        <h1 className="rail-name">Rattanapol Chongchirakitkul</h1>
        <p className="rail-sentence">Security, studied from both sides of the wire.</p>
        <nav className="rail-nav" aria-label="Sections">
          <a href="#work">Work</a>
          <a href="#letter">Letter</a>
          <a href="#contact">Contact</a>
          <a className="btn" href="mailto:RatChng@hotmail.com?subject=Hello%20from%20your%20portfolio">
            Email me
          </a>
        </nav>
        <button
          className="rail-menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          Menu
        </button>
        <div className="rail-menu-panel" hidden={!menuOpen}>
          <a href="#work" onClick={() => setMenuOpen(false)}>Work</a>
          <a href="#letter" onClick={() => setMenuOpen(false)}>Letter</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          <a href="mailto:RatChng@hotmail.com?subject=Hello%20from%20your%20portfolio">Email me</a>
        </div>
      </div>

      <div className="hero-rest" ref={frame2Ref}>
        <div className="hero-frame hero-frame--second">
          <img
            src="/assets/detail-1.jpg"
            alt="The back of a person's head, hair moving in the wind, against a plain grey backdrop"
          />
        </div>
      </div>
    </>
  )
}
