import { Router } from 'express'
import { z } from 'zod'

export const crtshRouter = Router()

crtshRouter.post('/lookup', async (req, res) => {
  try {
    const { domain } = z.object({ domain: z.string().min(3) }).parse(req.body)
    const clean = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim().toLowerCase()

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 20000)

    let data: any[]
    try {
      const response = await fetch(
        `https://crt.sh/?q=%.${clean}&output=json`,
        {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; Dorkly/1.0)',
          },
        }
      )
      clearTimeout(timeout)

      if (!response.ok) {
        return res.status(502).json({ error: `crt.sh returned ${response.status} — try again in a moment` })
      }

      const text = await response.text()
      if (!text || text.trim().length === 0) {
        return res.status(502).json({ error: 'crt.sh returned empty response — try again' })
      }

      // crt.sh sometimes returns HTML error pages — detect and reject
      if (text.trim().startsWith('<')) {
        return res.status(502).json({ error: 'crt.sh is under load — try again in a moment' })
      }

      try {
        data = JSON.parse(text)
      } catch {
        console.error('crt.sh parse error, body start:', text.slice(0, 100))
        return res.status(502).json({ error: 'crt.sh returned unexpected format — try again' })
      }
    } catch (fetchErr: any) {
      clearTimeout(timeout)
      if (fetchErr.name === 'AbortError') {
        return res.status(504).json({ error: 'crt.sh timed out (20s) — try a smaller domain or try again later' })
      }
      throw fetchErr
    }

    if (!Array.isArray(data) || data.length === 0) {
      return res.json({
        data: {
          domain: clean,
          subdomainCount: 0,
          subdomains: [],
          dorks: [],
          truncated: false,
        }
      })
    }

    const subdomains = [...new Set(
      data
        .flatMap(e => (e.name_value || '').split('\n'))
        .map((s: string) => s.trim().toLowerCase().replace(/^\*\./, ''))
        .filter((s: string) =>
          s.length > 0 &&
          s !== clean &&
          s.endsWith(`.${clean}`) &&
          !s.includes('*') &&
          !s.includes(' ') &&
          !s.includes('@')
        )
        .sort()
    )] as string[]

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
    console.error('crtsh route error:', e)
    res.status(500).json({ error: e.message || 'Lookup failed' })
  }
})
