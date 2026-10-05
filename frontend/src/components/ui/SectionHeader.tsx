import type { ReactNode } from 'react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export default function SectionHeader({ title, subtitle, icon, action, className = '' }: SectionHeaderProps) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-5 ${className}`}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-text-secondary shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-base font-semibold text-text-primary tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
