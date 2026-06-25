export type Difficulty = 'beginner' | 'intermediate' | 'advanced'
export type Category = 'security' | 'osint' | 'research' | 'recon' | 'custom' | 'all'

export interface Template {
  id: string
  title: string
  description: string
  query: string
  category: string
  tags: string[]
  difficulty: Difficulty
  usageCount: number
  createdAt: Date
}

export interface SavedDork {
  id: string
  title: string
  query: string
  description: string
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface DorkOperator {
  operator: string
  label: string
  description: string
  example: string
  placeholder: string
}

export const DORK_OPERATORS: DorkOperator[] = [
  { operator: 'site:', label: 'Site', description: 'Restrict results to a domain', example: 'site:example.com', placeholder: 'example.com' },
  { operator: 'filetype:', label: 'File type', description: 'Find specific file types', example: 'filetype:pdf', placeholder: 'pdf' },
  { operator: 'inurl:', label: 'In URL', description: 'Match text in the URL', example: 'inurl:admin', placeholder: 'admin' },
  { operator: 'intitle:', label: 'In title', description: 'Match text in page title', example: 'intitle:"login page"', placeholder: 'login' },
  { operator: 'intext:', label: 'In text', description: 'Match text in page body', example: 'intext:"password"', placeholder: 'password' },
  { operator: 'cache:', label: 'Cache', description: "View Google's cached version", example: 'cache:example.com', placeholder: 'example.com' },
  { operator: 'link:', label: 'Link', description: 'Find pages linking to a URL', example: 'link:example.com', placeholder: 'example.com' },
  { operator: 'related:', label: 'Related', description: 'Find sites similar to a URL', example: 'related:example.com', placeholder: 'example.com' },
]
export type Effectiveness = 'reliable' | 'high-value' | 'noisy' | 'unreliable' | 'unverified'

export const EFFECTIVENESS_META: Record<Effectiveness, { label: string; color: string; border: string; bg: string; tip: string }> = {
  'reliable':    { label: 'RELIABLE',    color: '#00e84d', border: 'rgba(0,232,77,0.35)',   bg: 'rgba(0,232,77,0.08)',   tip: 'Consistently returns useful results' },
  'high-value':  { label: 'HIGH VALUE',  color: '#00e5ff', border: 'rgba(0,229,255,0.35)',  bg: 'rgba(0,229,255,0.08)',  tip: 'Rare hit but critical when found' },
  'noisy':       { label: 'NOISY',       color: '#ffb300', border: 'rgba(255,179,0,0.35)',  bg: 'rgba(255,179,0,0.08)',  tip: 'High false-positive rate — verify manually' },
  'unreliable':  { label: 'UNRELIABLE',  color: '#ff5c5c', border: 'rgba(255,68,68,0.35)',  bg: 'rgba(255,68,68,0.08)',  tip: 'Google suppresses this pattern — low hit rate' },
  'unverified':  { label: 'UNVERIFIED',  color: 'rgba(0,232,77,0.4)', border: 'rgba(0,232,77,0.15)', bg: 'rgba(0,232,77,0.04)', tip: 'Community submitted — not independently verified' },
}
