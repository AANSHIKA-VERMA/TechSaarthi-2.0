import ReactMarkdown from 'react-markdown'

const components = {
  h1: ({ children }) => (
    <h2 className="font-display text-2xl font-semibold mt-8 mb-3" style={{ color: 'var(--ink)' }}>
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h3 className="font-display text-xl font-semibold mt-7 mb-3" style={{ color: 'var(--ink)' }}>
      {children}
    </h3>
  ),
  h3: ({ children }) => (
    <h4 className="font-display text-lg font-semibold mt-6 mb-2" style={{ color: 'var(--ink)' }}>
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="text-base leading-relaxed mb-4" style={{ color: '#3A3F55' }}>
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold" style={{ color: 'var(--ink)' }}>
      {children}
    </strong>
  ),
  ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1.5">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1.5">{children}</ol>,
  li: ({ children }) => (
    <li className="text-base leading-relaxed" style={{ color: '#3A3F55' }}>
      {children}
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote
      className="border-l-4 pl-4 my-4 italic"
      style={{ borderColor: 'var(--gold)', color: '#5B5A73' }}
    >
      {children}
    </blockquote>
  ),
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noreferrer" className="underline" style={{ color: 'var(--violet)' }}>
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code
      className="px-1.5 py-0.5 rounded text-sm font-mono"
      style={{ background: 'var(--paper-dim)', color: 'var(--ink)' }}
    >
      {children}
    </code>
  ),
}

export default function MarkdownContent({ children }) {
  return <ReactMarkdown components={components}>{children}</ReactMarkdown>
}
