import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css'
import Dashboard from './Dashboard';


function App() {
  const [count, setCount] = useState(0)

  return (

    <Router>

      <Routes>

        <Route path="/" element={<Dashboard />} />
        <Route path="/details/:deviceId" element={<Device />} />

        </Routes>
        </Router>

  )
}

export default App
