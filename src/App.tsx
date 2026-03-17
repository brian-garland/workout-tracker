import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './features/dashboard/Dashboard'
import { SessionView } from './features/session/SessionView'
import { ExerciseHistory } from './features/history/ExerciseHistory'
import { HistoryList } from './features/history/HistoryList'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/session/:date" element={<SessionView />} />
          <Route path="/history" element={<HistoryList />} />
          <Route path="/history/:exerciseId" element={<ExerciseHistory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
