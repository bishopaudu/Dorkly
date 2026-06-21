import { useState } from 'react'
import { ChevronDown, ChevronRight, GraduationCap } from 'lucide-react'

interface Level {
  num: string
  title: string
  summary: string
  content: { heading?: string; body: string; code?: string }[]
}

const LEVELS: Level[] = [
  {
    num: '00',
    title: 'What you\'re actually doing',
    summary: 'The mental model before the syntax',
    content: [
      { body: 'Google dorking is not "hacking Google." You\'re using Google\'s own advanced search grammar to filter its index more precisely than the search box normally allows. Everything you find was already public and already crawled — you\'re just asking better questions of data that already exists.' },
      { body: 'A dork is a precision filter, not an exploit. You\'re not breaking into anything. You\'re finding the door someone left open and forgot to mention.' },
    ],
  },
  {
    num: '01',
    title: 'Core operators',
    summary: 'Precise behavior, not just definitions',
    content: [
      { body: 'intitle:, inurl:, intext: only filter the next word. intitle:admin login means "title contains admin" + "page contains login anywhere." For both words in the title, use intitle:"admin login" or allintitle:admin login.' },
      { heading: 'cache: and link: are mostly dead', body: 'Google deprecated the cache viewer in 2024. link: has been heavily restricted for years and returns sparse, unreliable results. Don\'t build workflows around either.' },
      { heading: 'filetype: matches the extension Google sees', body: 'Not the MIME type. A PDF served without a .pdf extension in the URL won\'t match filetype:pdf even though it\'s genuinely a PDF.' },
    ],
  },
  {
    num: '02',
    title: 'Boolean logic',
    summary: 'Where most people quietly get it wrong',
    content: [
      { body: 'OR has lower precedence than implicit AND. Space-separated terms are ANDed automatically — OR only binds the two terms immediately touching it.' },
      { heading: 'The classic mistake', code: 'site:target.com filetype:bak OR filetype:backup', body: 'This parses as (site:target.com filetype:bak) OR (filetype:backup) — the second branch is completely unrestricted and pulls in noise from the entire web.' },
      { heading: 'Always parenthesize', code: 'site:target.com (filetype:bak OR filetype:backup)', body: 'If your dork has more than one logical branch, write the parentheses explicitly — don\'t assume Google parses it the way you mean.' },
      { body: '- excludes a term (-site:github.com). * is a wildcard for whole words, not characters. "exact phrase" forces literal adjacency.' },
    ],
  },
  {
    num: '03',
    title: 'Predicting results before you search',
    summary: 'Why "no results" is often correct, not broken',
    content: [
      { body: 'Experts predict what they\'ll find before running a query, based on three questions:' },
      { heading: '1. Does this file type typically get linked to anything?', body: 'Google mostly indexes what it crawled by following links or sitemaps. A .sql backup sitting in an unlinked directory is invisible to Google even though it\'s technically public by URL.' },
      { heading: '2. Did this pattern survive Google\'s abuse filtering?', body: 'Google has actively suppressed some of the most notorious classic dork patterns over the years. Some old GHDB entries simply don\'t fire anymore.' },
      { heading: '3. Would this target\'s stack even produce this artifact?', body: 'Don\'t run WordPress dorks against a target fingerprinted as a custom Node.js stack — you\'re wasting queries on impossible outcomes.' },
    ],
  },
  {
    num: '04',
    title: 'The recon workflow',
    summary: 'How a real engagement actually flows',
    content: [
      { heading: '1. Footprint broadly', code: 'site:target.com', body: 'See what Google has indexed at all — gives you a sense of surface size.' },
      { heading: '2. Enumerate subdomains', code: 'site:*.target.com -www', body: 'Subdomains are where the interesting stuff lives — dev, staging, internal tools, forgotten admin panels.' },
      { heading: '3. Fingerprint the stack', body: 'What paths and errors show up tells you which dork categories are even worth trying.' },
      { heading: '4. Targeted category sweeps', body: 'Now run specific category dorks — login panels, exposed files, error pages — informed by what you learned fingerprinting.' },
      { heading: '5. Pivot off findings', body: 'A single exposed .git directory or leaked email becomes the input to a new round of dorking elsewhere. Recon is iterative, not one search.' },
    ],
  },
  {
    num: '05',
    title: 'Advanced patterns',
    summary: 'Higher-precision techniques experts reach for',
    content: [
      { heading: 'File type + content signature', code: 'filetype:log intext:"Failed password for"', body: 'Much higher precision than either operator alone.' },
      { heading: 'Numeric ranges', code: 'site:target.com inurl:invoice 1000..2000', body: 'Useful for sequential IDs, invoice numbers, leaked document ranges.' },
      { heading: 'Default install titles', code: 'intitle:"Welcome to nginx!"', body: 'Software ships with predictable default titles before anyone customizes them — finds servers stood up and never configured.' },
      { heading: 'Stacking exclusions', code: '"target company" "password" -site:github.com -site:reddit.com', body: 'Cutting platform noise is unsexy but high-value — most raw dorks drown in irrelevant results without it.' },
      { heading: 'Vendor pivoting', code: '(site:trello.com OR site:notion.so OR site:*.atlassian.net) "target company"', body: 'Internal tools accidentally made public are some of the highest-signal OSINT finds — employees rarely think of Trello or Notion as "the internet."' },
    ],
  },
  {
    num: '06',
    title: 'The expert mindset',
    summary: 'What actually separates a pro from a dork-list copy-paster',
    content: [
      { body: 'They build queries live in response to what they find — a static list like GHDB is vocabulary, not a playbook. You combine vocabulary with judgment about the specific target in front of you.' },
      { body: 'They know what Google can\'t show them. Anything behind a login wall, blocked by robots.txt, on an intranet, or never linked — dorking can\'t touch it. It\'s one early-recon technique among many, not the whole toolkit.' },
      { body: 'They verify before celebrating. An exposed .env might be a deliberate sample file, not a real credential leak.' },
      { body: 'They respect scope and law religiously. Finding an exposed admin panel is dorking. Logging into it is unauthorized access — a crime in essentially every jurisdiction, even with valid-looking credentials. Real engagements happen under signed authorization.' },
      { body: 'They document everything — exact dork, timestamp, screenshot. Google\'s index changes; "I found it yesterday" isn\'t evidence if it\'s gone today.' },
    ],
  },
]

function LevelCard({ level }: { level: Level }) {
  const [open, setOpen] = useState(level.num === '00')

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        {open
          ? <ChevronDown size={13} style={{ color: '#00e84d', flexShrink: 0 }} />
          : <ChevronRight size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />}
        <span style={{
          fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-tertiary)',
          letterSpacing: '0.1em', flexShrink: 0, width: '20px',
        }}>
          {level.num}
        </span>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#00e84d', letterSpacing: '0.03em' }}>
            {level.title.toUpperCase()}
          </span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginLeft: '10px' }}>
            // {level.summary}
          </span>
        </div>
      </button>

      {open && (
        <div style={{
          borderTop: '1px solid var(--border-default)',
          padding: '14px 16px 16px 48px',
          animation: 'fadeIn 0.15s ease-out',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {level.content.map((block, i) => (
            <div key={i}>
              {block.heading && (
                <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {block.heading}
                </p>
              )}
              {block.code && (
                <div style={{
                  background: '#000',
                  border: '1px solid var(--border-default)',
                  borderRadius: '2px',
                  padding: '8px 12px',
                  margin: '6px 0',
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: '0.68rem',
                  color: '#00e84d',
                  wordBreak: 'break-all',
                }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>$ </span>{block.code}
                </div>
              )}
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {block.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CrashCourse() {
  return (
    <div className="card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <GraduationCap size={15} style={{ color: '#00e84d' }} />
        <p className="section-label" style={{ margin: 0 }}>// CRASH COURSE: BEGINNER TO EXPERT</p>
      </div>
      <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
        Seven levels, from "what is a dork" to thinking like a researcher. Click any level to expand.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {LEVELS.map(level => <LevelCard key={level.num} level={level} />)}
      </div>
    </div>
  )
}
