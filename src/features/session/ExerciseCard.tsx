import { Card } from '../../components/ui/Card'
import { CautionBanner } from '../../components/ui/CautionBanner'
import { SetInputRow } from './SetInputRow'
import { cautionExercises } from '../../data/cautions'
import type { PhaseExercise, Exercise } from '../../lib/types'

interface ExerciseCardProps {
  phaseExercise: PhaseExercise
  exercise: Exercise | undefined
  sets: Array<{ weight: string; reps: string }>
  onSetChange: (setIndex: number, field: 'weight' | 'reps', value: string) => void
}

export function ExerciseCard({ phaseExercise, exercise, sets, onSetChange }: ExerciseCardProps) {
  const cautionNote = cautionExercises[phaseExercise.exerciseName]

  return (
    <Card className="space-y-3">
      <div>
        <h3 className="font-semibold text-lg">{phaseExercise.exerciseName}</h3>
        <p className="text-sm text-text-muted">
          {phaseExercise.sets} sets &times; {phaseExercise.reps}
        </p>
        {exercise?.coaching_note && (
          <p className="text-sm text-text-muted mt-1 italic">{exercise.coaching_note}</p>
        )}
        {phaseExercise.note && (
          <p className="text-sm text-primary mt-1">{phaseExercise.note}</p>
        )}
      </div>

      {cautionNote && <CautionBanner message={cautionNote} />}

      <div className="space-y-2">
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span className="w-8 text-center">Set</span>
          <span className="w-20 text-center">Weight</span>
          <span className="w-4"></span>
          <span className="w-20 text-center">Reps</span>
        </div>
        {sets.map((set, i) => (
          <SetInputRow
            key={i}
            setNumber={i + 1}
            weight={set.weight}
            reps={set.reps}
            onWeightChange={(v) => onSetChange(i, 'weight', v)}
            onRepsChange={(v) => onSetChange(i, 'reps', v)}
          />
        ))}
      </div>
    </Card>
  )
}
