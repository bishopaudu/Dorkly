import { useLocation } from 'react-router-dom'
import { Crosshair, LayoutTemplate, Bookmark, ScanSearch, HelpCircle, Code2, Database, ChevronRight } from 'lucide-react'

const meta: Record<string, { title: string; description: string; icon: React.ElementType; cmd: string }> = {
  '/':          { title: 'BUILDER',   description: 'construct query',           icon: Crosshair,      cmd: 'dorkly build'    },
  '/templates': { title: 'TEMPLATES', description: 'browse dork library',       icon: LayoutTemplate, cmd: 'dorkly list'     },
  '/saved':     { title: 'SAVED',     description: 'personal dork library',     icon: Bookmark,       cmd: 'dorkly saved'    },
  '/scanner':   { title: 'SCANNER',   description: 'domain recon suite',        icon: ScanSearch,     cmd: 'dorkly scan'     },
  '/github':    { title: 'GITHUB',    description: 'code & secret recon',       icon: Code2,           cmd: 'dorkly gh-scan'  },
  '/ghdb':      { title: 'GHDB',      description: 'community dork database',   icon: Database,        cmd: 'dorkly ghdb'     },
  '/help':      { title: 'HELP',      description: 'docs and operator guide',   icon: HelpCircle,     cmd: 'dorkly --help'   },
}

export default function Topbar() {
  const { pathname } = useLocation()
  const page = meta[pathname] || meta['/']

  return (
    <header className="shrink-0 flex items-center px-5 py-3 border-b border-phosphor-400/10 bg-black/60 backdrop-blur-sm">
      <span className="text-phosphor-700 text-xs font-mono mr-2">~/dorkly</span>
      <ChevronRight size={12} className="text-phosphor-700 mr-2" />
      <span className="text-phosphor-500 text-xs font-mono mr-4">{page.cmd}</span>
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <span className="section-label">{page.title}</span>
        <span className="text-phosphor-700 text-2xs">// {page.description}</span>
      </div>
    </header>
  )
}
