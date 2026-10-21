import { useEffect } from 'react'

/**
 * Entrance layer: every [data-reveal] rises 22px and fades in, once,
 * staggered 75ms within its section: transform and opacity only.
 */
export function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))

    // stagger inside each section: heading, then text, then picture
    const groups = new Map<Element, number>()
    els.forEach((el) => {
      const section = el.closest('section, .hero, footer') ?? document.body
      const i = groups.get(section) ?? 0
      el.style.setProperty('--d', `${i * 75}ms`)
      groups.set(section, i + 1)
    })

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}
