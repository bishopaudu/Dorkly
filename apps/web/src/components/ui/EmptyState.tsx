import { type LucideIcon } from 'lucide-react'

interface Props {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}

export default function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-up">
      <div className="w-14 h-14 flex items-center justify-center mb-4 border border-phosphor-400/15"
           style={{ background: 'rgba(0,232,77,0.03)' }}>
        <Icon size={22} className="text-phosphor-600" />
      </div>
      <p className="section-label mb-2">{title}</p>
      <p className="text-xs text-phosphor-700 max-w-xs mb-4 leading-relaxed">{description}</p>
      {action}
    </div>
  )
}
