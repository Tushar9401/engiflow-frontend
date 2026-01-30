import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import './Dashboard.css';

const clients = [
  { id: 'CL-001', name: 'Acme Corp', contact: 'acme@example.com', phone: '+1 (415) 555-0182'},
  { id: 'CL-002', name: 'Global Build', contact: 'globalbuild@example.com', phone: '+1 (212) 555-0191' },
  { id: 'CL-003', name: 'Tech Infra', contact: 'techinfra@example.com', phone: '+1 (206) 555-0148' },
  { id: 'CL-004', name: 'Vertex Design', contact: 'vertex@example.com', phone: '+1 (312) 555-0174' },
];

export default function Clients() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) return clients;
    return clients.filter((client) => client.name.toLowerCase().includes(normalized));
  }, [searchQuery]);

  return (
    <div className="dashboard-layout">
      <aside className="side-nav">
        <div className="nav-brand">EngiFlow</div>
        <nav>
          <ul>
            <li className="dashboard-nav-item">
              <button className="nav-link" onClick={() => navigate('/admin')} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                <span role="img" aria-label="dashboard" style={{ marginRight: '8px' }}>📊</span>Home
              </button>
            </li>
            <li className="dashboard-nav-item">
              <button className="nav-link" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                <span role="img" aria-label="clients" style={{ marginRight: '8px' }}>👤</span>Clients
              </button>
            </li>
            <li className="dashboard-nav-item">
              <button
                className="nav-link"
                style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                onClick={() => navigate('/admin/rfqs?panel=admin&status=all', { state: { panel: 'admin', status: 'all' } })}
              >
                <span role="img" aria-label="rfqs" style={{ marginRight: '8px' }}>📄</span>RFQs
              </button>
            </li>
            <li className="dashboard-nav-item">
              <button
                className="nav-link"
                style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                onClick={() => navigate('/admin/reports?panel=admin', { state: { panel: 'admin' } })}
              >
                <span role="img" aria-label="reports" style={{ marginRight: '8px' }}>📊</span>View Reports
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
        <header className="admin-header">
          <h1><span className="admin-bold">Clients</span> <span className="admin-accent">Directory</span></h1>
          <p className="admin-lead">Manage client records and contact information</p>
        </header>

        <section className="admin-table-section">
          <div className="admin-table-header">
            <h2>All Clients</h2>
            <div className="admin-table-search">
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id}>
                  <td>{client.id}</td>
                  <td><b>{client.name}</b></td>
                  <td>{client.contact}</td>
                  <td>{client.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
