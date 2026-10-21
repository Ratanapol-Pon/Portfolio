import Hero from './sections/Hero'
import Intro from './sections/Intro'
import Work from './sections/Work'
import Proof from './sections/Proof'
import Stats from './sections/Stats'
import Letter from './sections/Letter'
import Toolkit from './sections/Toolkit'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import { useReveal } from './hooks/useReveal'

export default function App() {
  useReveal()
  return (
    <>
      <Hero />
      <main>
        <Intro />
        <Work />
        <Proof />
        <Stats />
        <Letter />
        <Toolkit />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
