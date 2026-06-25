import { Router } from 'express'
import { z } from 'zod'

export const crtshRouter = Router()

interface CrtEntry {
  name_value: string
  logged_at: string
  issuer_name: string
}

crtshRouter.post('/lookup', async (req, res) => {
  try {
    const { domain } = z.object({ domain: z.string().min(3) }).parse(req.body)
    const clean = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim().toLowerCase()

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    let response: Response
    try {
      response = await fetch(
        `https://crt.sh/?q=%.${clean}&output=json`,
        {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Dorkly OSINT Platform (educational use)',
          },
        }
      )
    } finally {
      clearTimeout(timeout)
    }

    if (!response.ok) {
      return res.status(502).json({ error: `crt.sh returned ${response.status} — try again in a moment` })
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json') && !contentType.includes('text/json')) {
      const text = await response.text()
      console.error('crt.sh returned non-JSON:', text.slice(0, 200))
      return res.status(502).json({ error: 'crt.sh returned unexpected response — it may be under load, try again' })
    }

    let data: CrtEntry[]
    try {
      data = await response.json()
    } catch {
      return res.status(502).json({ error: 'crt.sh response could not be parsed — try again' })
    }

    if (!Array.isArray(data)) {
      return res.status(502).json({ error: 'crt.sh returned no certificate data for this domain' })
    }

    const subdomains = [...new Set(
      data
        .flatMap(e => (e.name_value || '').split('\n'))
        .map(s => s.trim().toLowerCase().replace(/^\*\./, ''))
        .filter(s =>
          s.length > 0 &&
          s.endsWith(clean) &&
          s !== clean &&
          !s.includes('*') &&
          !s.includes(' ')
        )
        .sort()
    )]

    const dorks = subdomains.slice(0, 50).map(sub => ({
      subdomain: sub,
      dorks: [
        { title: 'All pages',     query: `site:${sub}` },
        { title: 'Login panels',  query: `site:${sub} (inurl:login OR inurl:admin)` },
        { title: 'Exposed files', query: `site:${sub} (filetype:env OR filetype:sql OR filetype:bak)` },
        { title: 'Documents',     query: `site:${sub} filetype:pdf` },
      ]
    }))

    res.json({
      data: {
        domain: clean,
        subdomainCount: subdomains.length,
        subdomains: subdomains.slice(0, 50),
        dorks,
        truncated: subdomains.length > 50,
      }
    })
  } catch (e: any) {
    if (e.name === 'AbortError') {
      return res.status(504).json({ error: 'crt.sh timed out (15s) — try a smaller domain or try again later' })
    }
    console.error('crtsh error:', e)
    res.status(500).json({ error: e.message || 'Lookup failed' })
  }
})
