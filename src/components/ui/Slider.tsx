interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  label?: string
}

export function Slider({ value, onChange, min = 0, max = 10, label }: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100
  const color = value <= 3 ? 'var(--color-success)' : value <= 6 ? 'var(--color-warning)' : 'var(--color-danger)'

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <div className="flex justify-between items-center">
          <label className="text-sm text-text-muted">{label}</label>
          <span className="text-lg font-bold tabular-nums" style={{ color }}>
            {value}
          </span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} ${percentage}%, var(--color-surface-bright) ${percentage}%)`,
        }}
      />
      <div className="flex justify-between text-xs text-text-muted">
        <span>None</span>
        <span>Severe</span>
      </div>
    </div>
  )
}
