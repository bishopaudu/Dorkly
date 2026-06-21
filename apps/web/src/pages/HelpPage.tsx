import { Crosshair, LayoutTemplate, Bookmark, ScanSearch, ChevronRight, Terminal, Shield, AlertTriangle } from 'lucide-react'

const OPERATORS = [
  { op: 'site:',     example: 'site:example.com',           desc: 'Restrict all results to a specific domain or subdomain.' },
  { op: 'filetype:', example: 'filetype:pdf',                desc: 'Find specific file types indexed by Google.' },
  { op: 'inurl:',    example: 'inurl:admin',                 desc: 'Match text anywhere in the URL of a result.' },
  { op: 'intitle:',  example: 'intitle:"index of"',          desc: 'Match text in the HTML title tag of a page.' },
  { op: 'intext:',   example: 'intext:"DB_PASSWORD"',        desc: 'Match text in the body content of a page.' },
  { op: 'cache:',    example: 'cache:example.com',           desc: "View Google's cached snapshot of a page." },
  { op: 'link:',     example: 'link:example.com',            desc: 'Find pages that link to the specified URL.' },
  { op: 'related:',  example: 'related:example.com',         desc: 'Find websites similar to the specified URL.' },
]

const PAGES = [
  {
    icon: Crosshair,
    name: 'BUILDER',
    path: '/',
    summary: 'Construct dork queries visually without memorising syntax.',
    steps: [
      'Click any operator button (site:, filetype:, inurl:, etc.) to add it to your query',
      'Fill in the value for each operator in the input that appears',
      'Add free text keywords in the top field for broader matching',
      'Watch the live query preview update in real time at the bottom',
      'Hit Search Google to open results in a new tab, or Copy to grab the query',
      'Save the query to your library with the Save dork button',
    ],
    tips: [
      'Combine multiple operators for precision — site: + filetype: is a classic pairing',
      'Wrap multi-word values in quotes: intitle:"login page" not intitle:login page',
      'Load any template from the Templates page directly into the builder to customise it',
    ],
  },
  {
    icon: LayoutTemplate,
    name: 'TEMPLATES',
    path: '/templates',
    summary: 'Browse 100+ curated dork templates organised by category and difficulty.',
    steps: [
      'Use the category filter buttons to narrow by security, OSINT, research, or recon',
      'Type in the search bar to find templates by keyword',
      'Click any template row to open the detail panel on the right',
      'Hit Load into builder to pull the query into the Builder for customisation',
      'Hit Search Google to run the template query instantly',
      'Hit Save to library to add it to your personal Saved page',
    ],
    tips: [
      'Difficulty badges tell you how sensitive the query is — start with beginner',
      'Usage count shows which dorks the community finds most valuable',
      'Templates are great starting points — always customise the domain for real targets',
    ],
  },
  {
    icon: Bookmark,
    name: 'SAVED',
    path: '/saved',
    summary: 'Your personal dork library — dorks you have saved from Builder or Templates.',
    steps: [
      'All dorks you save appear here, sorted by most recently saved',
      'Use the search bar to filter by title or query text',
      'Click any row to open the detail panel',
      'Load into builder, Search Google, or Copy from the row action buttons',
      'Delete a dork permanently with the trash icon',
    ],
    tips: [
      'Build collections for specific targets or engagement types',
      'Use descriptive titles so you can find dorks quickly later',
    ],
  },
  {
    icon: ScanSearch,
    name: 'SCANNER',
    path: '/scanner',
    summary: 'Enter any domain and auto-generate a full recon dork suite across 8 attack surface categories.',
    steps: [
      'Enter a domain name — bare domain, URL, or subdomain all work',
      'Hit Scan — the tool strips the protocol and generates dorks automatically',
      'Results are grouped into 8 categories: files, logins, docs, subdomains, code leaks, errors, redirects, vendor',
      'Expand or collapse each category with the arrow',
      'For each dork: load into builder, copy, open in Google, or save to library',
      'Use the Quick Platform Links to pivot to Shodan, GitHub, or Pastebin',
    ],
    tips: [
      'Always get explicit written permission before scanning a target domain',
      'Start with Exposed Files and Login Panels — highest signal categories',
      'Vendor dorking (GitHub, Trello, Notion) often reveals more than direct site dorks',
      'Combine Scanner output with Shodan for infrastructure-level recon',
    ],
  },
]

const CATEGORIES = [
  { id: 'security', label: 'SECURITY', color: '#ff4444', desc: 'Exposed files, login panels, misconfigurations, SQL errors' },
  { id: 'osint',    label: 'OSINT',    color: '#00e5ff', desc: 'People, usernames, social profiles, leaked credentials' },
  { id: 'research', label: 'RESEARCH', color: '#00e84d', desc: 'Documents, PDFs, government records, public data' },
  { id: 'recon',    label: 'RECON',    color: '#ffb300', desc: 'Subdomains, infrastructure, tech stack fingerprinting' },
]

interface Section { icon: typeof Crosshair; name: string; path: string; summary: string; steps: string[]; tips: string[] }

function PageSection({ section }: { section: Section }) {
  const Icon = section.icon
  return (
    <div className="card" style={{ padding: '20px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div style={{
          width: '32px', height: '32px',
          border: '1px solid rgba(0,232,77,0.2)',
          background: 'rgba(0,232,77,0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={15} style={{ color: '#00e84d' }} />
        </div>
        <div>
          <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#00e84d', letterSpacing: '0.08em' }}>{section.name}</p>
          <p style={{ fontSize: '0.65rem', color: 'rgba(0,232,77,0.62)' }}>{section.summary}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <p className="section-label" style={{ marginBottom: '10px' }}>// HOW TO USE</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {section.steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{
                  fontSize: '0.55rem', fontWeight: 700,
                  color: 'rgba(0,232,77,0.48)',
                  letterSpacing: '0.1em',
                  marginTop: '2px',
                  flexShrink: 0,
                  width: '16px',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p style={{ fontSize: '0.68rem', color: 'rgba(0,232,77,0.78)', lineHeight: 1.6 }}>{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="section-label" style={{ marginBottom: '10px' }}>// PRO TIPS</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {section.tips.map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <ChevronRight size={11} style={{ color: '#00e84d', flexShrink: 0, marginTop: '3px' }} />
                <p style={{ fontSize: '0.68rem', color: 'rgba(0,232,77,0.72)', lineHeight: 1.6 }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-up">

      <div>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#00e84d', letterSpacing: '0.05em' }}>
          HELP & DOCUMENTATION
        </h2>
        <p style={{ fontSize: '0.7rem', color: 'rgba(0,232,77,0.62)', marginTop: '3px' }}>
          everything you need to know about using dorkly
        </p>
      </div>

      {/* What is Google Dorking */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Terminal size={15} style={{ color: '#00e84d' }} />
          <p className="section-label">// WHAT IS GOOGLE DORKING?</p>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'rgba(0,232,77,0.78)', lineHeight: 1.8, marginBottom: '12px' }}>
          Google Dorking — also called Google Hacking — is the practice of using advanced Google search operators
          to find information that standard searches miss. By combining operators like <code style={{ color: '#00e84d', fontFamily: 'IBM Plex Mono, monospace' }}>site:</code>,{' '}
          <code style={{ color: '#00e84d', fontFamily: 'IBM Plex Mono, monospace' }}>filetype:</code>, and{' '}
          <code style={{ color: '#00e84d', fontFamily: 'IBM Plex Mono, monospace' }}>intitle:</code>, you can surface
          exposed files, login panels, sensitive documents, misconfigured servers, and much more — all from publicly
          indexed data.
        </p>
        <p style={{ fontSize: '0.72rem', color: 'rgba(0,232,77,0.78)', lineHeight: 1.8 }}>
          Dorkly makes this accessible to everyone — security researchers, OSINT analysts, journalists, and
          competitive intelligence professionals — without needing to memorise operator syntax or write queries
          from scratch.
        </p>
      </div>

      {/* Operator reference */}
      <div className="card" style={{ padding: '20px' }}>
        <p className="section-label" style={{ marginBottom: '14px' }}>// OPERATOR REFERENCE</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {OPERATORS.map(({ op, example, desc }) => (
            <div key={op} style={{
              display: 'grid',
              gridTemplateColumns: '90px 220px 1fr',
              gap: '16px',
              padding: '9px 12px',
              borderRadius: '2px',
              alignItems: 'center',
              transition: 'background 0.1s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,232,77,0.04)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <code style={{ fontSize: '0.72rem', fontWeight: 700, color: '#00e84d', fontFamily: 'IBM Plex Mono, monospace' }}>
                {op}
              </code>
              <code style={{ fontSize: '0.65rem', color: 'rgba(0,232,77,0.68)', fontFamily: 'IBM Plex Mono, monospace' }}>
                {example}
              </code>
              <p style={{ fontSize: '0.68rem', color: 'rgba(0,232,77,0.5)', lineHeight: 1.5 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Template categories */}
      <div className="card" style={{ padding: '20px' }}>
        <p className="section-label" style={{ marginBottom: '14px' }}>// TEMPLATE CATEGORIES</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {CATEGORIES.map(cat => (
            <div key={cat.id} style={{
              padding: '12px 14px',
              border: `1px solid ${cat.color}25`,
              background: `${cat.color}08`,
              borderRadius: '2px',
            }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, color: cat.color, letterSpacing: '0.1em', marginBottom: '4px' }}>
                {cat.label}
              </p>
              <p style={{ fontSize: '0.68rem', color: 'rgba(0,232,77,0.68)', lineHeight: 1.5 }}>
                {cat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Page guides */}
      <div>
        <p className="section-label" style={{ marginBottom: '12px' }}>// PAGE GUIDES</p>
        {PAGES.map(section => <PageSection key={section.name} section={section} />)}
      </div>

      {/* Legal disclaimer */}
      <div style={{
        padding: '16px 20px',
        border: '1px solid rgba(255,179,0,0.2)',
        background: 'rgba(255,179,0,0.04)',
        borderRadius: '2px',
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <AlertTriangle size={15} style={{ color: '#ffb300', flexShrink: 0, marginTop: '1px' }} />
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#ffb300', letterSpacing: '0.08em', marginBottom: '6px' }}>
              LEGAL DISCLAIMER
            </p>
            <p style={{ fontSize: '0.68rem', color: 'rgba(255,179,0,0.6)', lineHeight: 1.7 }}>
              Dorkly is built for legitimate security research, OSINT, and educational purposes only.
              All searches open in Google or other public search engines — Dorkly never accesses target systems directly.
              Always obtain explicit written permission before conducting reconnaissance on systems you do not own.
              Users are solely responsible for complying with applicable laws, regulations, and terms of service.
            </p>
          </div>
        </div>
      </div>

      {/* Ethical use */}
      <div style={{
        padding: '16px 20px',
        border: '1px solid rgba(0,232,77,0.12)',
        background: 'rgba(0,232,77,0.03)',
        borderRadius: '2px',
        marginBottom: '32px',
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <Shield size={15} style={{ color: '#00e84d', flexShrink: 0, marginTop: '1px' }} />
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#00e84d', letterSpacing: '0.08em', marginBottom: '6px' }}>
              ETHICAL USE
            </p>
            <p style={{ fontSize: '0.68rem', color: 'rgba(0,232,77,0.5)', lineHeight: 1.7 }}>
              The information surfaced by Google dorks is publicly available and already indexed.
              The power of dorking comes with responsibility — use it to find vulnerabilities so they can be fixed,
              to uncover public records for legitimate research, or to understand your own attack surface.
              Never use these techniques to access, copy, or damage systems without authorisation.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
