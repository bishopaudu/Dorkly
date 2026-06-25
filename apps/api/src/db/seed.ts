import { db, schema } from './index'
import { randomUUID } from 'crypto'

const templates = [
  { title: 'Exposed login pages', description: 'Find exposed admin login panels', query: 'intitle:"admin login" inurl:admin', category: 'security', tags: ['admin','login','exposed'], difficulty: 'beginner', effectiveness: 'reliable', effectivenessNote: 'Consistently returns results across most targets' },
  { title: 'Open directory listings', description: 'Discover open directory indexes', query: 'intitle:"index of" inurl:ftp', category: 'security', tags: ['directory','ftp','files'], difficulty: 'beginner', effectiveness: 'reliable', effectivenessNote: 'Classic dork, still works well' },
  { title: 'Exposed env files', description: 'Find publicly accessible .env files', query: 'filetype:env intext:"DB_PASSWORD"', category: 'security', tags: ['env','credentials','leak'], difficulty: 'intermediate', effectiveness: 'high-value', effectivenessNote: 'Rare hit but critical when found' },
  { title: 'PDF documents on a domain', description: 'Find all public PDF files on a site', query: 'site:example.com filetype:pdf', category: 'research', tags: ['pdf','documents','files'], difficulty: 'beginner', effectiveness: 'reliable', effectivenessNote: 'Replace example.com with your target' },
  { title: 'Exposed camera feeds', description: 'Find unsecured IP camera interfaces', query: 'intitle:"webcamXP" inurl:8080', category: 'security', tags: ['camera','iot','exposed'], difficulty: 'intermediate', effectiveness: 'unreliable', effectivenessNote: 'Google increasingly suppresses IoT dorks' },
  { title: 'SQL error pages', description: 'Find pages leaking SQL errors', query: 'intext:"sql syntax near" intext:"mysql_fetch"', category: 'security', tags: ['sql','error','injection'], difficulty: 'advanced', effectiveness: 'noisy', effectivenessNote: 'High false-positive rate — verify manually' },
  { title: 'WordPress config files', description: 'Find exposed WordPress configs', query: 'filetype:txt inurl:wp-config', category: 'security', tags: ['wordpress','config','cms'], difficulty: 'intermediate', effectiveness: 'reliable', effectivenessNote: 'Works well on poorly configured WP installs' },
  { title: 'LinkedIn employee search', description: 'Find employees at a company', query: 'site:linkedin.com/in "Company Name"', category: 'osint', tags: ['linkedin','people','recon'], difficulty: 'beginner', effectiveness: 'reliable', effectivenessNote: 'Replace Company Name with target org' },
  { title: 'Pastebin leaks', description: 'Search for sensitive data on Pastebin', query: 'site:pastebin.com "password" "username"', category: 'osint', tags: ['pastebin','credentials','leak'], difficulty: 'beginner', effectiveness: 'noisy', effectivenessNote: 'Very noisy — combine with specific target keywords' },
  { title: 'Government documents', description: 'Find public government PDFs', query: 'site:.gov filetype:pdf "confidential"', category: 'research', tags: ['government','documents','public'], difficulty: 'beginner', effectiveness: 'reliable', effectivenessNote: 'Solid — .gov sites are well indexed' },
  { title: 'Exposed spreadsheets', description: 'Find publicly indexed Excel files', query: 'filetype:xlsx intext:"password" -site:github.com', category: 'research', tags: ['excel','spreadsheet','data'], difficulty: 'beginner', effectiveness: 'high-value', effectivenessNote: 'Exclusion of GitHub keeps results focused' },
  { title: 'API keys in code', description: 'Find exposed API keys on GitHub', query: 'site:github.com intext:"api_key" filetype:env', category: 'security', tags: ['api','keys','github'], difficulty: 'advanced', effectiveness: 'high-value', effectivenessNote: 'High value when it hits — GitHub indexes fast' },
  { title: 'Subdomain discovery', description: 'Enumerate subdomains of a target', query: 'site:*.example.com -www', category: 'recon', tags: ['subdomain','recon','enumeration'], difficulty: 'intermediate', effectiveness: 'reliable', effectivenessNote: 'Replace example.com with target domain' },
  { title: 'Forum posts by person', description: 'Find forum activity linked to a username', query: 'intext:"username" (site:reddit.com OR site:forum.com)', category: 'osint', tags: ['username','forum','social'], difficulty: 'beginner', effectiveness: 'noisy', effectivenessNote: 'Replace "username" with actual handle' },
  { title: 'Exposed backup files', description: 'Find database and site backup files', query: '(filetype:sql OR filetype:bak) intext:"INSERT INTO"', category: 'security', tags: ['backup','sql','database'], difficulty: 'advanced', effectiveness: 'high-value', effectivenessNote: 'Rare but critical — direct DB exposure' },
  { title: 'News articles about company', description: 'Research press coverage of a company', query: '(site:news.google.com OR site:techcrunch.com) "Company Name"', category: 'research', tags: ['news','pr','media'], difficulty: 'beginner', effectiveness: 'reliable', effectivenessNote: 'Replace Company Name with target' },
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
      effectiveness: t.effectiveness,
      effectivenessNote: t.effectivenessNote,
      usageCount: 0,
      createdAt: new Date(),
    }).onConflictDoNothing()
  }
  console.log(`Seeded ${templates.length} templates.`)
}

seed().catch(console.error)
