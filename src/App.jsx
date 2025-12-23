import Signup from './pages/Signup'
import Login from './pages/Login'
import Services from './pages/Services'
import Dashboard from './pages/Dashboard'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/services" element={<Services />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
