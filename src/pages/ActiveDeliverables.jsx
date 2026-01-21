import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminDashboard.css';

// Sample deliverables dataset (replace with API data when available)
const allDeliverables = [
  { id: 'DEL-2026-001', title: 'Foundation Drawings', description: 'Complete foundation drawings and rebar schedules', attachments: [{name:'foundations.pdf', url:'#'}], assigned: ['ABC Constructions'] },
  { id: 'DEL-2026-002', title: 'Reinforcement Layout', description: 'Detailed reinforcement layout for ground floor slab', attachments: [], assigned: ['XYZ Subcontractors', 'ABC Constructions'] },
  { id: 'DEL-2026-003', title: 'Temporary Works', description: 'Shoring and temporary works drawings', attachments: [{name:'shoring.pdf', url:'#'}], assigned: ['SubCo A'] },
];

export default function ActiveDeliverables() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  // Hash fallback (HashRouter may embed query in hash)
  const hashParams = (() => {
    try {
      const h = window && window.location && window.location.hash;
      if (!h) return null;
      const qi = h.indexOf('?');
      if (qi === -1) return null;
      return new URLSearchParams(h.substring(qi));
    } catch (e) {
      return null;
    }
  })();

  const subcontractor = (location && location.state && location.state.subcontractor)
    ? location.state.subcontractor
    : (params.get('subcontractor') || (hashParams && hashParams.get('subcontractor')) || 'ABC Constructions');

  // Deliverables visible to this subcontractor
  const deliverables = allDeliverables.filter(d => d.assigned && d.assigned.includes(subcontractor));

  function renderSubcontractorSidebar() {
    return (
      <aside className="side-nav">
        <div className="nav-brand">EngiFlow</div>
        <nav>
          <ul>
            <li className="dashboard-nav-item">
              <button className="nav-link" onClick={()=>navigate('/subcontractor')} style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                <span role="img" aria-label="dashboard" style={{marginRight: '8px'}}>🏠</span>Home
              </button>
            </li>
            <li className="dashboard-nav-item">
              <button className="nav-link" onClick={() => navigate('/subcontractor/active-deliverables?subcontractor=' + encodeURIComponent(subcontractor))} style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                <span role="img" aria-label="deliverables" style={{marginRight: '8px'}}>📦</span>Active Deliverables
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
    );
  }

  return (
    <div className="dashboard-layout">
      {renderSubcontractorSidebar()}

      <main className="dashboard-main">
        <header style={{ padding: '28px 24px 0 24px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: 6, fontWeight: 800, color: '#5b4fff' }}>Active Deliverables</h1>
          <p style={{ color: '#6b7280', marginBottom: 20 }}>Deliverables assigned to you. Only subcontractors listed on each item can access them.</p>
        </header>

        <div style={{ padding: 24 }}>
          <section className="admin-table-section">
            <div className="admin-table-header">
              <h2>Assigned Deliverables</h2>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Deliverable ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Attachments</th>
                </tr>
              </thead>
              <tbody>
                {deliverables.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: 20, color: '#9ca3af' }}>No deliverables assigned to {subcontractor}.</td>
                  </tr>
                ) : (
                  deliverables.map((d, i) => (
                    <tr key={i} style={{ cursor: 'pointer' }} onClick={() => navigate(`/rfq/${d.id}?panel=subcontractor`, { state: { panel: 'subcontractor', subcontractor } })}>
                      <td
                        style={{ fontFamily: 'monospace', color: '#374151', cursor: 'pointer' }}
                        onClick={(e) => {
                          // open deliverable detail when clicking the ID only
                          e.stopPropagation();
                          navigate(`/deliverable/${d.id}`, { state: { from: '/subcontractor/active-deliverables', subcontractor } });
                        }}
                      >
                        {d.id}
                      </td>
                      <td><b>{d.title}</b></td>
                      <td>{d.description.length > 60 ? d.description.slice(0, 60) + '...' : d.description}</td>
                      <td>{d.attachments && d.attachments.length > 0 ? d.attachments.map((a, idx) => (<div key={idx} style={{marginBottom:6}}><a href={a.url} target="_blank" rel="noreferrer" style={{color:'#5b4fff'}}>{a.name}</a></div>)) : '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </div>
  );
}
