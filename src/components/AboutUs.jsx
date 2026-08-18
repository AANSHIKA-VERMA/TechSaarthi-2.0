export default function AboutUs() {
  return (
    <section id="about" className="py-20 md:py-28" style={{ background: 'var(--ink)' }}>
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[1fr_1.3fr] gap-12 items-start">
        <p className="font-mono text-xs tracking-[0.25em] uppercase" style={{ color: 'var(--gold)' }}>
          Why TechSaarthi
        </p>

        <div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-white leading-tight mb-6">
            Talent isn't the gap. Visibility is.
          </h2>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: 'var(--muted)' }}>
            Every year, women BTech students miss internships, scholarships and
            fellowships they'd have qualified for — not for lack of skill, but because
            the listing was buried in a WhatsApp forward, a stale PDF, or a portal
            nobody checks. TechSaarthi exists to close that gap: one place to discover
            opportunities, understand them in plain language, and act before the
            deadline passes.
          </p>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl mt-4" style={{ color: 'var(--muted)' }}>
            We built it from a simple belief — a good guide doesn't just point at the
            destination, it helps you find your own way there.
          </p>
        </div>
      </div>
    </section>
  )
}
