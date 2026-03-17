import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface DataPoint {
  date: string
  weight: number
}

interface ExerciseChartProps {
  data: DataPoint[]
}

export function ExerciseChart({ data }: ExerciseChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-text-muted text-sm">
        No data yet. Complete some sessions to see progress.
      </div>
    )
  }

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-bright)" />
          <XAxis
            dataKey="date"
            tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
            tickFormatter={(v: string) => {
              const d = new Date(v + 'T12:00:00')
              return `${d.getMonth() + 1}/${d.getDate()}`
            }}
          />
          <YAxis
            tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
            domain={['dataMin - 10', 'dataMax + 10']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-surface-bright)',
              borderRadius: '12px',
              color: 'var(--color-text)',
            }}
            labelFormatter={(v) => {
              const d = new Date(String(v) + 'T12:00:00')
              return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            }}
            formatter={(value) => [`${value} lbs`, 'Max Weight']}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="var(--color-primary)"
            strokeWidth={2}
            dot={{ fill: 'var(--color-primary)', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
