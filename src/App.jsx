import { useEffect, useState } from 'react'
import Signup from './pages/Signup'
import Login from './pages/Login'
import './App.css'

function App() {
  const [route, setRoute] = useState(() => {
    const h = window.location.hash.replace('#', '')
    return h || '/login'
  })

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash.replace('#', '') || '/login')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (route === '/signup') return <Signup />
  return <Login />
}

export default App
