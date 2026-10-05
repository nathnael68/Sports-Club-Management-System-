import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'brand'
  size?: 'sm' | 'md'
  className?: string
}

const variants = {
  default: 'bg-white/[0.04] text-text-secondary border-white/[0.06]',
  success: 'bg-[rgba(90,158,122,0.12)] text-success-400 border-success-500/20',
  warning: 'bg-[rgba(196,163,90,0.12)] text-warning-400 border-warning-500/20',
  danger: 'bg-[rgba(184,92,92,0.12)] text-danger-400 border-danger-500/20',
  info: 'bg-[rgba(107,140,174,0.12)] text-info-400 border-info-500/20',
  brand: 'bg-[rgba(93,154,138,0.12)] text-brand-400 border-brand-500/20',
  accent: 'bg-[rgba(201,123,90,0.12)] text-accent-400 border-accent-500/20',
}

const sizes = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-1 text-xs',
}

export default function Badge({ children, variant = 'default', size = 'sm', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium tracking-wide uppercase rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  )
}
