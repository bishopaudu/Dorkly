import { Router } from 'express'
import { z } from 'zod'

export const scannerRouter = Router()

const SCAN_CATEGORIES = [
  {
    id: 'exposed_files',
    label: 'Exposed Files',
    description: 'Sensitive files publicly accessible',
    dorks: (d: string) => [
      { title: 'Environment files',     query: `site:${d} filetype:env` },
      { title: 'Config files',          query: `site:${d} filetype:config` },
      { title: 'Backup files',          query: `site:${d} (filetype:bak OR filetype:backup)` },
      { title: 'Log files',             query: `site:${d} filetype:log` },
      { title: 'SQL dumps',             query: `site:${d} filetype:sql` },
    ],
  },
  {
    id: 'login_panels',
    label: 'Login Panels',
    description: 'Admin and login pages',
    dorks: (d: string) => [
      { title: 'Admin panels',          query: `site:${d} inurl:admin` },
      { title: 'Login pages',           query: `site:${d} inurl:login` },
      { title: 'Dashboard pages',       query: `site:${d} inurl:dashboard` },
      { title: 'Control panels',        query: `site:${d} (inurl:cpanel OR inurl:wp-admin)` },
      { title: 'Signin pages',          query: `site:${d} (intitle:"sign in" OR intitle:"log in")` },
    ],
  },
  {
    id: 'exposed_docs',
    label: 'Exposed Documents',
    description: 'Public documents and reports',
    dorks: (d: string) => [
      { title: 'PDF documents',         query: `site:${d} filetype:pdf` },
      { title: 'Word documents',        query: `site:${d} (filetype:doc OR filetype:docx)` },
      { title: 'Excel spreadsheets',    query: `site:${d} (filetype:xls OR filetype:xlsx)` },
      { title: 'Confidential docs',     query: `site:${d} filetype:pdf intitle:"confidential"` },
      { title: 'Internal reports',      query: `site:${d} filetype:pdf intitle:"internal"` },
    ],
  },
  {
    id: 'subdomains',
    label: 'Subdomains',
    description: 'Subdomain enumeration',
    dorks: (d: string) => [
      { title: 'All subdomains',        query: `site:*.${d} -www` },
      { title: 'Dev subdomains',        query: `site:*.${d} (inurl:dev OR inurl:staging)` },
      { title: 'API subdomains',        query: `site:*.${d} inurl:api` },
      { title: 'Mail subdomains',       query: `site:*.${d} (inurl:mail OR inurl:webmail)` },
      { title: 'Test subdomains',       query: `site:*.${d} (inurl:test OR inurl:uat)` },
    ],
  },
  {
    id: 'code_leaks',
    label: 'Code & Keys',
    description: 'Exposed source code and credentials',
    dorks: (d: string) => [
      { title: 'GitHub mentions',       query: `site:github.com "${d}"` },
      { title: 'Pastebin leaks',        query: `site:pastebin.com "${d}"` },
      { title: 'API keys in code',      query: `site:github.com "${d}" (apikey OR api_key)` },
      { title: 'Passwords in code',     query: `site:github.com "${d}" (password OR passwd)` },
      { title: 'Cloud storage leaks',   query: `(site:s3.amazonaws.com OR site:storage.googleapis.com) "${d}"` },
    ],
  },
  {
    id: 'errors',
    label: 'Error Pages',
    description: 'SQL errors and stack traces',
    dorks: (d: string) => [
      { title: 'SQL errors',            query: `site:${d} intext:"sql syntax near"` },
      { title: 'PHP errors',            query: `site:${d} intext:"Warning: mysql_fetch"` },
      { title: 'Stack traces',          query: `site:${d} intext:"stack trace" intext:"at line"` },
      { title: 'Database errors',       query: `site:${d} (intext:"ORA-" OR intext:"MySQL Error")` },
      { title: 'Exception pages',       query: `site:${d} intitle:"error" intext:"exception"` },
    ],
  },
  {
    id: 'open_redirects',
    label: 'Open Redirects',
    description: 'Redirect and endpoint vulnerabilities',
    dorks: (d: string) => [
      { title: 'Redirect params',       query: `site:${d} inurl:redirect=http` },
      { title: 'URL params',            query: `site:${d} inurl:url=http` },
      { title: 'Next params',           query: `site:${d} inurl:next=http` },
      { title: 'Return params',         query: `site:${d} inurl:return=http` },
      { title: 'File upload endpoints', query: `site:${d} inurl:upload` },
    ],
  },
  {
    id: 'vendor',
    label: 'Vendor Dorking',
    description: 'Cross-platform intelligence gathering',
    dorks: (d: string) => [
      { title: 'GitHub repos',          query: `site:github.com "${d}"` },
      { title: 'Shodan (manual)',       query: `hostname:${d}` },
      { title: 'Trello boards',         query: `site:trello.com "${d}"` },
      { title: 'Notion pages',          query: `site:notion.so "${d}"` },
      { title: 'Jira tickets',          query: `site:*.atlassian.net "${d}"` },
    ],
  },
]

scannerRouter.post('/scan', async (req, res) => {
  try {
    const { domain } = z.object({ domain: z.string().min(3) }).parse(req.body)
    const clean = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim()
    const results = SCAN_CATEGORIES.map(cat => ({
      id: cat.id,
      label: cat.label,
      description: cat.description,
      dorks: cat.dorks(clean),
    }))
    res.json({ data: { domain: clean, categories: results, total: results.reduce((a, c) => a + c.dorks.length, 0) } })
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ error: 'Invalid domain' })
    res.status(500).json({ error: 'Scan failed' })
  }
})
