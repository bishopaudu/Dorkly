import { Router } from 'express'
import { z } from 'zod'

export const githubRouter = Router()

const GITHUB_CATEGORIES = [
  {
    id: 'secrets',
    label: 'API Keys & Secrets',
    description: 'Exposed credentials and tokens in code',
    dorks: (q: string) => [
      { title: 'Generic API keys',       query: `"${q}" ("api_key" OR "apikey")` },
      { title: 'AWS access keys',        query: `"${q}" "AKIA" AWS_ACCESS_KEY_ID` },
      { title: 'Private keys (PEM)',     query: `"${q}" "BEGIN RSA PRIVATE KEY"` },
      { title: 'Slack tokens',           query: `"${q}" ("xoxb-" OR "xoxp-")` },
      { title: 'Database connection strings', query: `"${q}" ("mongodb://" OR "postgres://")` },
      { title: 'Hardcoded passwords',    query: `"${q}" "password" (extension:env OR extension:yml)` },
    ],
  },
  {
    id: 'config',
    label: 'Config Files',
    description: 'Environment and configuration leaks',
    dorks: (q: string) => [
      { title: '.env files',             query: `"${q}" filename:.env` },
      { title: 'YAML configs',           query: `"${q}" extension:yml filename:config` },
      { title: 'JSON configs',           query: `"${q}" extension:json filename:config` },
      { title: 'Docker compose files',   query: `"${q}" filename:docker-compose.yml` },
      { title: 'Kubernetes secrets',     query: `"${q}" kind:Secret extension:yaml` },
    ],
  },
  {
    id: 'infra',
    label: 'Infrastructure',
    description: 'Cloud and deployment configuration',
    dorks: (q: string) => [
      { title: 'Terraform state files',  query: `"${q}" filename:terraform.tfstate` },
      { title: 'SSH config files',       query: `"${q}" filename:.ssh/config` },
      { title: 'Ansible vault files',    query: `"${q}" filename:vault.yml` },
      { title: 'Nginx configs',          query: `"${q}" filename:nginx.conf` },
      { title: 'CI/CD pipeline secrets', query: `"${q}" filename:.gitlab-ci.yml "password"` },
    ],
  },
  {
    id: 'company',
    label: 'Company Mentions',
    description: 'Internal references and employee activity',
    dorks: (q: string) => [
      { title: 'Org repositories',       query: `org:"${q}"` },
      { title: 'Internal domain mentions', query: `"${q}" ("internal" OR "staging")` },
      { title: 'Commit messages mentioning company', query: `"${q}" in:commit` },
      { title: 'Issues mentioning credentials', query: `"${q}" ("password" OR "secret") in:issue` },
      { title: 'Forked private-looking repos', query: `"${q}" fork:true` },
    ],
  },
  {
    id: 'code_quality',
    label: 'Code Weaknesses',
    description: 'Risky patterns and TODOs',
    dorks: (q: string) => [
      { title: 'TODO/FIXME security notes', query: `"${q}" "TODO" "security"` },
      { title: 'Disabled SSL verification', query: `"${q}" ("verify=False" OR "rejectUnauthorized: false")` },
      { title: 'Hardcoded IPs',          query: `"${q}" extension:js /\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b/` },
      { title: 'Debug mode enabled',     query: `"${q}" ("DEBUG = True" OR "debug: true")` },
      { title: 'Commented-out auth checks', query: `"${q}" ("// auth" OR "# auth")` },
    ],
  },
]

githubRouter.post('/scan', async (req, res) => {
  try {
    const { query } = z.object({ query: z.string().min(2) }).parse(req.body)
    const clean = query.trim()
    const categories = GITHUB_CATEGORIES.map(cat => ({
      id: cat.id,
      label: cat.label,
      description: cat.description,
      dorks: cat.dorks(clean),
    }))
    res.json({
      data: {
        query: clean,
        categories,
        total: categories.reduce((a, c) => a + c.dorks.length, 0),
      },
    })
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ error: 'Invalid query — enter a domain, org, or keyword' })
    res.status(500).json({ error: 'Scan failed' })
  }
})
