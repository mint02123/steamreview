import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import SpecCards from '../components/landing/SpecCards'
import CoreCapabilities from '../components/landing/CoreCapabilities'
import InsightArchitecture from '../components/landing/InsightArchitecture'
import ModelIntro from '../components/landing/ModelIntro'
import Differentiator from '../components/landing/Differentiator'
import UseCases from '../components/landing/UseCases'
import CTA from '../components/landing/CTA'
import Footer from '../components/landing/Footer'

export default function Landing() {
  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <main>
        <Hero />
        <SpecCards />
        <CoreCapabilities />
        <InsightArchitecture />
        <ModelIntro />
        <Differentiator />
        <UseCases />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
