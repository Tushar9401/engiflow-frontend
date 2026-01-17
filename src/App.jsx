import AdminDashboard from './pages/AdminDashboard';
import ProjectsList from './pages/ProjectsList';
import Signup from './pages/Signup'
import Login from './pages/Login'
import DashboardLayout from './pages/DashboardLayout'
import DashboardHome from './pages/DashboardHome'
import DashboardServicesCivil from './pages/DashboardServicesCivil'
import DashboardServicesStructural from './pages/DashboardServicesStructural'
import RFQDetail from './pages/RFQDetail';
import ActiveRFQs from './pages/ActiveRFQs';
import PMDashboard from './pages/PMDashboard';
import SubcontractorDashboard from './pages/SubcontractorDashboard'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      {/* keep legacy /services redirect to new dashboard civil page */}
      <Route path="/services" element={<Navigate to="/dashboard/civil" replace />} />

      <Route path="/dashboard/*" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="civil" element={<DashboardServicesCivil />} />
        <Route path="structural" element={<DashboardServicesStructural />} />
      </Route>

  <Route path="/" element={<Login />} />
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/admin/projects" element={<ProjectsList />} />
  <Route path="/admin/rfqs" element={<ActiveRFQs />} />
  <Route path="/pm" element={<PMDashboard />} />
  <Route path="/subcontractor" element={<SubcontractorDashboard />} />
  <Route path="/rfq/:id" element={<RFQDetail />} />
  <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
