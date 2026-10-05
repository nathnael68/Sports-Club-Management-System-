import type { ReactNode } from 'react'

interface DataTableProps {
  children: ReactNode
  className?: string
}

export function DataTable({ children, className = '' }: DataTableProps) {
  return (
    <div className={`overflow-x-auto rounded-xl border border-white/[0.06] ${className}`}>
      <table className="w-full text-left text-sm">
        {children}
      </table>
    </div>
  )
}

export function DataTableHead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-bg-surface text-xs uppercase tracking-wider text-text-secondary border-b border-white/[0.06]">
      {children}
    </thead>
  )
}

export function DataTableBody({ children }: { children: ReactNode }) {
  return (
    <tbody className="divide-y divide-white/[0.04]">
      {children}
    </tbody>
  )
}

export function DataTableRow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <tr className={`transition-colors hover:bg-white/[0.02] ${className}`}>
      {children}
    </tr>
  )
}

export function DataTableCell({ children, className = '', numeric = false }: { children: ReactNode; className?: string; numeric?: boolean }) {
  return (
    <td className={`py-3 px-4 ${numeric ? 'text-right tabular-nums' : ''} ${className}`}>
      {children}
    </td>
  )
}

export function DataTableHeader({ children, className = '', numeric = false }: { children: ReactNode; className?: string; numeric?: boolean }) {
  return (
    <th className={`py-3 px-4 font-medium ${numeric ? 'text-right' : ''} ${className}`}>
      {children}
    </th>
  )
}
