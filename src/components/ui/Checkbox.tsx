interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
}

export function Checkbox({ checked, onChange, label, description }: CheckboxProps) {
  return (
    <button
      type="button"
      className="flex items-start gap-3 py-2 cursor-pointer active:bg-surface-bright rounded-xl px-2 -mx-2 w-full text-left"
      onClick={() => onChange(!checked)}
    >
      <div className="pt-0.5">
        <div
          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors
            ${checked ? 'bg-primary border-primary' : 'border-text-muted/40 bg-transparent'}`}
        >
          {checked && (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-base ${checked ? 'line-through text-text-muted' : 'text-text'}`}>
          {label}
        </div>
        {description && (
          <div className="text-sm text-text-muted mt-0.5">{description}</div>
        )}
      </div>
    </button>
  )
}
