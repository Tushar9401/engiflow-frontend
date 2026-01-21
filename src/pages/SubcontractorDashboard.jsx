import React, { useState } from 'react';
import './SubcontractorDashboard.css';
import './AdminDashboard.css';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

export default function SubcontractorDashboard() {
  const navigate = useNavigate();
  // sample data - replace with API hooks when available
  const [company] = useState('ABC Constructions');
  const [stats] = useState({ assigned: 6, openBids: 2, completed: 18 });

  const [deliverables, setDeliverables] = useState([
    { id: "RFQ-2024-001", title: 'Cement Work', description: 'Cement column and footing works. Reinforcement to spec.', status: 'Assigned', due: '2026-02-10' },
    { id: "RFQ-2024-002", title: 'Steel Fabrication', description: 'Fabricate and deliver steel beams for levels 1-3.', status: 'Open', due: '2026-03-01' },
    { id: "RFQ-2024-003", title: 'Formwork', description: 'Temporary formwork for basement slab.', status: 'In Progress', due: '2026-01-25' },
  ]);

  function updateStatus(id, status) {
    setDeliverables(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  }

  return (
    <div className="dashboard-layout">
      <aside className="side-nav">
        <div className="nav-brand">EngiFlow</div>
        <nav>
          <ul>
            <li className="dashboard-nav-item">
              <button className="nav-link" onClick={() => navigate('/subcontractor')} style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                <span role="img" aria-label="dashboard" style={{marginRight: '8px'}}>🏠</span>Home
              </button>
            </li>
            <li className="dashboard-nav-item">
              <button className="nav-link" onClick={() => navigate('/subcontractor/active-deliverables?subcontractor=' + encodeURIComponent(company), { state: { subcontractor: company } })} style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                <span role="img" aria-label="rfqs" style={{marginRight: '8px'}}>📦</span>Active Deliverables
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
          <h1><span className="admin-bold">Welcome,</span> <span style={{color: '#5b4fff'}}>{company}</span></h1>
          <p className="admin-lead">Subcontractor dashboard — quick view of your tasks and bids</p>
        </header>

        <section className="cards">
  <div className="stat-card" onClick={() => navigate('/subcontractor/active-deliverables', { state: { subcontractor: company } })} style={{ cursor: 'pointer' }}>
          <div className="stat-top">
            <div className="icon">🧰</div>
            <div>
              <div className="stat-label">Assigned</div>
            </div>
          </div>
          <div className="stat-value-large">{stats.assigned}</div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="icon">✅</div>
            <div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
          <div className="stat-value-large">{stats.completed}</div>
        </div>
        </section>

        <section className="deliverables-section">
        <div className="section-header">
          <h2>Deliverables</h2>
          <div className="section-actions">
            <input placeholder="Search deliverables" className="search" />
          </div>
        </div>

        <div className="deliverables-table">
          <div className="table-head">
            <div>ID</div>
            <div>Title</div>
            <div className="desc-col">Description</div>
            {/* <div>Due</div> */}
          </div>
          {deliverables.map(d => (
            <div key={d.id} className="table-row" style={{ cursor: 'pointer' }} onClick={() => navigate(`/rfq/${d.id}?panel=subcontractor`, { state: { panel: 'subcontractor', subcontractor: company } })}>
              <div className="id-col">{d.id}</div>
              <div className="title-col">{d.title}</div>
              <div className="desc-col"><div className="desc-text">{d.description}</div></div>
              {/* <div>{d.due}</div> */}
            </div>
          ))}
        </div>
        </section>

        <footer style={{marginTop: 28}}>
          <div className="muted">Tip: Click Accept to confirm deliverable. Use New Proposal to submit bids.</div>
        </footer>
      </main>
    </div>
  );
}
