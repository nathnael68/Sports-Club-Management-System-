import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  unit?: string
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  variant?: 'default' | 'brand' | 'accent' | 'success' | 'warning' | 'danger'
  className?: string
}

const variantStyles = {
  default: 'border-white/[0.06]',
  brand: 'border-brand-500/20',
  accent: 'border-accent-500/20',
  success: 'border-success-500/20',
  warning: 'border-warning-500/20',
  danger: 'border-danger-500/20',
}

const iconBgStyles = {
  default: 'bg-white/[0.04] text-text-secondary',
  brand: 'bg-brand-500/10 text-brand-400',
  accent: 'bg-accent-500/10 text-accent-400',
  success: 'bg-success-500/10 text-success-400',
  warning: 'bg-warning-500/10 text-warning-400',
  danger: 'bg-danger-500/10 text-danger-400',
}

const trendColors = {
  up: 'text-success-400',
  down: 'text-danger-400',
  neutral: 'text-text-tertiary',
}

export default function StatCard({
  label,
  value,
  unit,
  icon,
  trend,
  trendValue,
  variant = 'default',
  className = '',
}: StatCardProps) {
  return (
    <div
      className={`surface-elevated rounded-xl p-5 border ${variantStyles[variant]} transition-all duration-300 hover:border-hover hover:bg-bg-elevated-hover group ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-text-secondary">
          {label}
        </span>
        {icon && (
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBgStyles[variant]} transition-transform duration-300 group-hover:scale-110`}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tracking-tight text-text-primary">
          {value}
        </span>
        {unit && (
          <span className="text-sm text-text-tertiary font-medium">{unit}</span>
        )}
      </div>
      {trend && trendValue && (
        <div className={`mt-2 text-xs font-medium ${trendColors[trend]}`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'} {trendValue}
        </div>
      )}
    </div>
  )
}
