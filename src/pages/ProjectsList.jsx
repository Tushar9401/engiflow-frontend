import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './AdminDashboard.css';

const sampleProjects = [
  { id: 'PRJ-2024-001', client: 'Acme Corp', status: 'Completed', start_date: '2024-01-15',end_date: '2024-05-30' },
  { id: 'PRJ-2024-002', client: 'Global Build', status: 'In Progress', start_date: '2024-06-03',end_date: '2024-12-15' },
  { id: 'PRJ-2024-003', client: 'Tech Infra', status: 'On Hold', start_date: '2023-11-20',end_date: '2024-04-10' },
  { id: 'PRJ-2024-004', client: 'Greenfield Ltd', status: 'Bidding', start_date: '2024-03-08',end_date: '2024-09-30' },
];

export default function ProjectsList() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      <aside className="side-nav" style={{ position: 'sticky', top: 0, height: '100vh', alignSelf: 'flex-start', overflow: 'auto', paddingTop: '24px' }}>
        <div className="nav-brand">EngiFlow</div>
        <nav>
          <ul>
            <li className="dashboard-nav-item">
              <button className="nav-link" onClick={()=>navigate('/admin')}style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                <span role="img" aria-label="dashboard" style={{marginRight: '8px'}}>📊</span>Home
              </button>
            </li>
            <li className="dashboard-nav-item">
              <button className="nav-link" onClick={() => navigate('/admin/clients')} style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
               <span role="img" aria-label="clients" style={{marginRight: '8px'}}>👤</span>Clients
              </button>
            </li>
            <li className="dashboard-nav-item">
              <button className="nav-link"
                onClick={() => navigate('/admin/rfqs?panel=admin&status=all', { state: { panel: 'admin', status: 'all' } })}
                style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                  <span role="img" aria-label="rfqs" style={{marginRight: '8px'}}>📄</span>RFQs
              </button>
            </li>
            <li className="dashboard-nav-item">
              <button
                className="nav-link"
                style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}
                onClick={() => navigate('/admin/reports?panel=admin', { state: { panel: 'admin' } })}
              >
                <span role="img" aria-label="reports" style={{marginRight: '8px'}}>📊</span>View Reports
              </button>
            </li>
          </ul>
        </nav>
        <div className="nav-footer">
          <button className="btn" onClick={() => {
            localStorage.removeItem('isLoggedIn');
            navigate('/', { replace: true });
          }}>Sign Out</button>
        </div>
      </aside>
      <main className="dashboard-main">
        <header style={{ padding: '28px 24px 0 24px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: 6, fontWeight: 800, color: '#5b4fff' }}>Projects</h1>
          <p style={{ color: '#6b7280', marginBottom: 20 }}>List of projects — click a row for details.</p>
        </header>

        <div style={{ padding: 24 }}>
          <section className="admin-table-section">
            <div className="admin-table-header">
              <h2>Projects</h2>
              <div className="admin-table-search">
                <input type="text" placeholder="Search Projects..." />
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 14, padding: 18, boxShadow: '0 6px 18px rgba(15,23,42,0.04)' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Project ID</th>
                    <th>Client</th>
                    <th>Project Status</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleProjects.map((p) => (
                    <tr key={p.id} style={{ cursor: 'pointer' }}>
                      <td>{p.id}</td>
                      <td><b>{p.client}</b></td>
                      <td><span style={{ background: p.status === 'Completed' ? '#eef2ff' : '#f8fafc', color: p.status === 'Completed' ? '#4c51bf' : '#6b7280', padding: '6px 10px', borderRadius: 10 }}>{p.status}</span></td>
                      <td>{p.start_date}</td>
                      <td>{p.end_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
