import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Welcome from './pages/welcome'
import Play from './pages/Play'
import Leaderboards from './pages/Leaderboards'
import PlayerSelection from './pages/PlayerSelection'
import CreatePlayer from './pages/CreatePlayer'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/select-player" element={<PlayerSelection />} />
          <Route path="/create-player" element={<CreatePlayer />} />
          <Route path="/play" element={<Play />} />
          <Route path="/leaderboards" element={<Leaderboards />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
