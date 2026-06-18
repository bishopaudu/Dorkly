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