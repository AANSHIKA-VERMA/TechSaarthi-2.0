const offerings = [
  {
    title: 'Curated, not crawled',
    body: 'Every opportunity is reviewed for legitimacy and eligibility before it goes live — no expired links, no spam forms.',
  },
  {
    title: 'One page per opportunity',
    body: 'Organization, deadline, tags, apply link and a reference video, plus a full brief a click away.',
  },
  {
    title: 'Save for later',
    body: 'Bookmark anything mid-scroll and come back when you\u2019re ready to apply.',
  },
  {
    title: 'TechSaarthi AI',
    body: 'Ask about eligibility, next steps, or just how to get unstuck — the assistant knows the listings and the landscape.',
  },
]

export default function WhatWeOffer() {
  return (
    <section id="offer" className="py-20 md:py-28" style={{ background: 'var(--paper)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <p className="font-mono text-xs tracking-[0.25em] uppercase mb-3" style={{ color: 'var(--violet-deep)' }}>
          What we offer
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold mb-12 max-w-lg" style={{ color: 'var(--ink)' }}>
          Built to remove friction, not add features
        </h2>

        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-10">
          {offerings.map((o, i) => (
            <div key={o.title} className="flex gap-4">
              <span
                className="font-mono text-xs mt-1 shrink-0 w-6 h-6 rounded-full grid place-items-center"
                style={{ background: 'var(--ink)', color: 'var(--gold)' }}
              >
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold mb-1.5" style={{ color: 'var(--ink)' }}>
                  {o.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#5B5A73' }}>
                  {o.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
