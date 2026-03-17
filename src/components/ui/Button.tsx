import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const base = 'font-semibold rounded-xl transition-colors active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none'

  const variants = {
    primary: 'bg-primary text-white hover:brightness-110',
    secondary: 'bg-surface-bright text-text hover:brightness-110',
    danger: 'bg-danger text-white hover:brightness-110',
    ghost: 'bg-transparent text-text-muted hover:bg-surface-bright',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm min-h-[36px]',
    md: 'px-4 py-2.5 text-base min-h-[44px]',
    lg: 'px-6 py-3.5 text-lg min-h-[52px] w-full',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  )
}
