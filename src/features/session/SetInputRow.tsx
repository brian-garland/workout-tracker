import { NumberInput } from '../../components/ui/Input'

interface SetInputRowProps {
  setNumber: number
  weight: string
  reps: string
  onWeightChange: (value: string) => void
  onRepsChange: (value: string) => void
}

export function SetInputRow({ setNumber, weight, reps, onWeightChange, onRepsChange }: SetInputRowProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-text-muted w-8 text-center">{setNumber}</span>
      <NumberInput
        placeholder="lbs"
        value={weight}
        onChange={(e) => onWeightChange(e.target.value)}
        step={5}
      />
      <span className="text-text-muted">&times;</span>
      <NumberInput
        placeholder="reps"
        value={reps}
        onChange={(e) => onRepsChange(e.target.value)}
        step={1}
      />
    </div>
  )
}
