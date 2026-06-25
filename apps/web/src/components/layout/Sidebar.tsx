import { NavLink } from 'react-router-dom'
import { Terminal, LayoutTemplate, Bookmark, Crosshair, ScanSearch, HelpCircle, Code2, Database, Shield } from 'lucide-react'
import { clsx } from 'clsx'

const nav = [
  { to: '/',          icon: Crosshair,      label: 'builder',   prefix: '01' },
  { to: '/templates', icon: LayoutTemplate, label: 'templates', prefix: '02' },
  { to: '/saved',     icon: Bookmark,       label: 'saved',     prefix: '03' },
  { to: '/scanner',   icon: ScanSearch,     label: 'scanner',   prefix: '04' },
  { to: '/github',    icon: Code2,          label: 'github',    prefix: '05' },
  { to: '/ghdb',      icon: Database,       label: 'ghdb',      prefix: '06' },
  { to: '/crtsh',     icon: Shield,         label: 'crt.sh',    prefix: '07' },
  { to: '/help',      icon: HelpCircle,     label: 'help',      prefix: '08' },
]

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 flex flex-col border-r border-phosphor-400/10 bg-black/80 backdrop-blur-sm">
      <div className="px-4 py-5 border-b border-phosphor-400/10">
        <div className="flex items-center gap-2.5 mb-1">
          <Terminal size={16} className="text-phosphor-400" />
          <span className="text-sm font-bold text-phosphor-400 tracking-widest uppercase">DORKLY</span>
        </div>
        <p className="text-2xs text-phosphor-700 tracking-widest pl-[24px]">v1.0.0 // OSINT PLATFORM</p>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {nav.map(({ to, icon: Icon, label, prefix }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2.5 text-xs font-mono font-medium transition-all duration-100',
              isActive
                ? 'text-phosphor-400 bg-phosphor-400/8 border-l-2 border-phosphor-400'
                : 'text-phosphor-700 border-l-2 border-transparent hover:text-phosphor-400 hover:bg-phosphor-400/5 hover:border-phosphor-400/30'
            )}>
            <span className="text-phosphor-700/50 text-2xs w-4">{prefix}</span>
            <Icon size={14} />
            <span className="tracking-wider">{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-phosphor-400/10">
        <div className="text-2xs text-phosphor-700 space-y-1 font-mono">
          <div className="flex justify-between"><span>STATUS</span><span className="text-phosphor-500">● ONLINE</span></div>
          <div className="flex justify-between"><span>BUILD</span><span className="text-phosphor-500">EARLY ACCESS</span></div>
        </div>
      </div>
    </aside>
  )
}
