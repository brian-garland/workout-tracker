interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'primary'
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-surface-bright text-text-muted',
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    primary: 'bg-primary/20 text-primary',
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}
