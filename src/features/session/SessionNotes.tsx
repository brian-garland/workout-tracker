import { Card } from '../../components/ui/Card'
import { Slider } from '../../components/ui/Slider'

interface SessionNotesProps {
  painLevel: number
  onPainChange: (value: number) => void
  notes: string
  onNotesChange: (value: string) => void
}

export function SessionNotes({ painLevel, onPainChange, notes, onNotesChange }: SessionNotesProps) {
  return (
    <Card className="space-y-4">
      <Slider
        label="Pain Level"
        value={painLevel}
        onChange={onPainChange}
        min={0}
        max={10}
      />
      <div>
        <label className="text-sm text-text-muted block mb-1">Session Notes</label>
        <textarea
          className="w-full bg-surface-bright text-text rounded-xl px-3 py-2.5 outline-none
            focus:ring-2 focus:ring-primary placeholder:text-text-muted/50
            min-h-[80px] resize-none"
          placeholder="How did the session feel? Any issues?"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </div>
    </Card>
  )
}
