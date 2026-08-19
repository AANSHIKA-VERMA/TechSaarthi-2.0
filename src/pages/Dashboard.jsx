import Navbar from '../components/Navbar'
import OpportunitySection from '../components/OpportunitySection'
import WhatWeOffer from '../components/WhatWeOffer'
import AboutUs from '../components/AboutUs'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { useChat } from '../context/ChatContext'

export default function Dashboard() {
  const { user } = useAuth()
  const { motivateMe } = useChat()
  const firstName =
    user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'

  return (
    <div>
      <Navbar variant="dashboard" />

      <section className="py-16 md:py-20" style={{ background: 'var(--ink)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <p className="font-mono text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'var(--gold)' }}>
            Your route
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-white max-w-2xl leading-tight">
            Welcome back, {firstName}.
          </h1>
          <p className="mt-4 max-w-xl text-sm md:text-base" style={{ color: 'var(--muted)' }}>
            Pick a category below to see the full list — organization, deadline, tags,
            and a save button so you can come back to it later.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={motivateMe}
              className="px-6 py-3 rounded-full font-medium text-sm transition-transform hover:-translate-y-0.5"
              style={{ background: 'var(--gold)', color: 'var(--ink)' }}
            >
              ✨ Motivate me
            </button>
            <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
              or ask the AI guide anything using the chat icon, bottom right
            </p>
          </div>
        </div>
      </section>

      <OpportunitySection />
      <WhatWeOffer />
      <AboutUs />
      <Footer />
    </div>
  )
}
