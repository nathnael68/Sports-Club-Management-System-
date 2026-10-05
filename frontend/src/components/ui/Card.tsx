import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export default function Card({ children, className = '', hover = true, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`surface-elevated rounded-xl border border-white/[0.06] transition-all duration-300 ${
        hover ? 'hover:border-white/[0.10] hover:bg-bg-elevated-hover' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
