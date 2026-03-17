import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-text-muted">{label}</label>}
      <input
        className={`bg-surface-bright text-text rounded-xl px-3 py-2.5 text-lg outline-none
          focus:ring-2 focus:ring-primary placeholder:text-text-muted/50
          min-h-[44px] ${className}`}
        {...props}
      />
    </div>
  )
}

export function NumberInput(props: InputProps) {
  return (
    <Input
      type="number"
      inputMode="decimal"
      className="text-center w-20 tabular-nums"
      {...props}
    />
  )
}
