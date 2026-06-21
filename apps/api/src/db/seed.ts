import { db, schema } from './index'
import { randomUUID } from 'crypto'

const templates = [
  { title: 'Exposed login pages', description: 'Find exposed admin login panels', query: 'intitle:"admin login" inurl:admin', category: 'security', tags: ['admin','login','exposed'], difficulty: 'beginner' },
  { title: 'Open directory listings', description: 'Discover open directory indexes', query: 'intitle:"index of" inurl:ftp', category: 'security', tags: ['directory','ftp','files'], difficulty: 'beginner' },
  { title: 'Exposed env files', description: 'Find publicly accessible .env files', query: 'filetype:env intext:"DB_PASSWORD"', category: 'security', tags: ['env','credentials','leak'], difficulty: 'intermediate' },
  { title: 'PDF documents on a domain', description: 'Find all public PDF files on a site', query: 'site:example.com filetype:pdf', category: 'research', tags: ['pdf','documents','files'], difficulty: 'beginner' },
  { title: 'Exposed camera feeds', description: 'Find unsecured IP camera interfaces', query: 'intitle:"webcamXP" inurl:8080', category: 'security', tags: ['camera','iot','exposed'], difficulty: 'intermediate' },
  { title: 'SQL error pages', description: 'Find pages leaking SQL errors', query: 'intext:"sql syntax near" intext:"mysql_fetch"', category: 'security', tags: ['sql','error','injection'], difficulty: 'advanced' },
  { title: 'WordPress config files', description: 'Find exposed WordPress configs', query: 'filetype:txt inurl:wp-config', category: 'security', tags: ['wordpress','config','cms'], difficulty: 'intermediate' },
  { title: 'LinkedIn employee search', description: 'Find employees at a company', query: 'site:linkedin.com/in "Company Name"', category: 'osint', tags: ['linkedin','people','recon'], difficulty: 'beginner' },
  { title: 'Pastebin leaks', description: 'Search for sensitive data on Pastebin', query: 'site:pastebin.com "password" "username"', category: 'osint', tags: ['pastebin','credentials','leak'], difficulty: 'beginner' },
  { title: 'Government documents', description: 'Find public government PDFs', query: 'site:.gov filetype:pdf "confidential"', category: 'research', tags: ['government','documents','public'], difficulty: 'beginner' },
  { title: 'Exposed spreadsheets', description: 'Find publicly indexed Excel files', query: 'filetype:xlsx intext:"password" -site:github.com', category: 'research', tags: ['excel','spreadsheet','data'], difficulty: 'beginner' },
  { title: 'API keys in code', description: 'Find exposed API keys on GitHub', query: 'site:github.com intext:"api_key" filetype:env', category: 'security', tags: ['api','keys','github'], difficulty: 'advanced' },
  { title: 'Subdomain discovery', description: 'Enumerate subdomains of a target', query: 'site:*.example.com -www', category: 'recon', tags: ['subdomain','recon','enumeration'], difficulty: 'intermediate' },
  { title: 'Forum posts by person', description: 'Find forum activity linked to a username', query: 'intext:"username" (site:reddit.com OR site:forum.com)', category: 'osint', tags: ['username','forum','social'], difficulty: 'beginner' },
  { title: 'Exposed backup files', description: 'Find database and site backup files', query: '(filetype:sql OR filetype:bak) intext:"INSERT INTO"', category: 'security', tags: ['backup','sql','database'], difficulty: 'advanced' },
  { title: 'News articles about company', description: 'Research press coverage of a company', query: '(site:news.google.com OR site:techcrunch.com) "Company Name"', category: 'research', tags: ['news','pr','media'], difficulty: 'beginner' },
]

async function seed() {
  console.log('Seeding templates...')
  for (const t of templates) {
    await db.insert(schema.templates).values({
      id: randomUUID(),
      title: t.title,
      description: t.description,
      query: t.query,
      category: t.category,
      tags: JSON.stringify(t.tags),
      difficulty: t.difficulty,
      usageCount: 0,
      createdAt: new Date(),
    }).onConflictDoNothing()
  }
  console.log(`Seeded ${templates.length} templates.`)
}

seed().catch(console.error)
