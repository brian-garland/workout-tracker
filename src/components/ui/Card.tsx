import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  highlight?: boolean
}

export function Card({ highlight, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`bg-surface rounded-2xl p-4 ${highlight ? 'ring-2 ring-primary' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
