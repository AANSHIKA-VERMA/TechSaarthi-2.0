import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import OpportunitySection from '../components/OpportunitySection'
import AboutUs from '../components/AboutUs'
import WhatWeOffer from '../components/WhatWeOffer'
import Footer from '../components/Footer'

export default function Landing() {
  return (
    <div>
      <Navbar variant="public" />
      <Hero />
      <OpportunitySection />
      <WhatWeOffer />
      <AboutUs />
      <Footer />
    </div>
  )
}
