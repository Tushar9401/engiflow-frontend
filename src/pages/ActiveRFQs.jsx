import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminDashboard.css';

const rfqs = [
  {
    id: 'RFQ-2024-001',
    client: 'Acme Corp',
    description: 'Structural Design',
    project_status: 'In Progress',
    submitted: '2024-12-30',
    end_date: '2026-01-01',
  },
  {
    id: 'RFQ-2024-002',
    client: 'Global Build',
    description: 'Civil Works',
    project_status: 'Bidding',
    submitted: '2024-12-29',
    end_date: '2026-01-01',
  },
  {
    id: 'RFQ-2024-003',
    client: 'Tech Infra',
    description: 'Site Investigation and concrete testing',
    project_status: 'On Hold',
    submitted: '2024-12-28',
    end_date: '2026-01-01',
  },
];

export default function ActiveRFQs() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  // HashRouter can place the query inside the hash fragment (e.g. #/rfq/id?panel=dashboard)
  // so also parse window.location.hash as a fallback.
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
  const panel = (location && location.state && location.state.panel)
    ? location.state.panel
    : (params.get('panel') || (hashParams && hashParams.get('panel')) || 'dashboard');
  const status = (location && location.state && location.state.status)
    ? location.state.status
    : (params.get('status') || (hashParams && hashParams.get('status')) || 'active');

  const title = status === 'completed' ? 'Completed RFQ' : status === 'pending' ? 'Pending RFQs' : status === 'all' ? 'All RFQs' : 'Active RFQs';

  function renderAdminSidebar() {
    return (
      <aside className="side-nav">
        <div className="nav-brand">EngiFlow</div>
        <nav>
          <ul>
            <li className="dashboard-nav-item">
              <button className="nav-link" onClick={()=>navigate('/admin')} style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                <span role="img" aria-label="dashboard" style={{marginRight: '8px'}}>📊</span>Home
              </button>
            </li>
            <li className="dashboard-nav-item">
              <button className="nav-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
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
    );
  }

  function renderPMSidebar() {
    return (
      <aside className="side-nav">
        <div className="nav-brand">EngiFlow</div>
        <nav>
          <ul>
            <li className="dashboard-nav-item">
              <button className="nav-link" onClick={()=>navigate('/pm')} style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                <span role="img" aria-label="dashboard" style={{marginRight: '8px'}}>📊</span>Home
              </button>
            </li>
            <li className="dashboard-nav-item">
              <button className="nav-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                <span role="img" aria-label="projects" style={{marginRight: '8px'}}>📁</span>Projects
              </button>
            </li>
            <li className="dashboard-nav-item">
              <button className="nav-link" onClick={() => navigate('/admin/rfqs?panel=pm&status=all')} style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                 <span role="img" aria-label="rfqs" style={{marginRight: '8px'}}>📄</span>RFQs
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

    function renderSubcontractorSidebar() {
      return (
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
                <button className="nav-link" onClick={() => navigate('/admin/rfqs?panel=subcontractor&status=all', { state: { panel: 'subcontractor' } })} style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                  <span role="img" aria-label="rfqs" style={{marginRight: '8px'}}>📄</span>All RFQs
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

  function renderDashboardSidebar() {
    return (
      <aside className="side-nav">
        <div className="nav-brand">EngiFlow</div>
        <nav>
          <ul>
            <li className="dashboard-nav-item">
              <button className="nav-link"onClick={()=>navigate('/dashboard')} style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                <span role="img" aria-label="home" style={{marginRight: '8px'}}>🏠</span>Home
              </button>
            </li>
            <li className="dashboard-nav-item">
              <button className="nav-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}} onClick={() => {/* open modal if needed */}}>
                <span role="img" aria-label="quote" style={{marginRight: '8px'}}>📝</span>Request Quotation
              </button>
            </li>
            <li className="dashboard-nav-item">
              <button className="nav-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                <span role="img" aria-label="report" style={{marginRight: '8px'}}>📊</span>View Reports
              </button>
            </li>
            <li className="dashboard-nav-item">
                  <button className="nav-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}} onClick={() => {/* TODO: Implement action */}}>
                    <span role="img" aria-label="support" style={{marginRight: '8px'}}>💬</span>Contact Support
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
  {panel === 'admin' ? renderAdminSidebar() : panel === 'pm' ? renderPMSidebar() : panel === 'subcontractor' ? renderSubcontractorSidebar() : renderDashboardSidebar()}

      <main className="dashboard-main">
        <header style={{ padding: '28px 24px 0 24px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: 6, fontWeight: 800, color: '#5b4fff' }}>{title}</h1>
          <p style={{ color: '#6b7280', marginBottom: 20 }}>
            {status === 'pending' ? 'List of RFQs awaiting review or action.' : status === 'completed' ? 'List of completed RFQs.' : status === 'all' ? 'All RFQs across all statuses.' : 'List of currently active requests for quotation.'}
          </p>
        </header>

        <div style={{ padding: 24 }}>
          <section className="admin-table-section">
            <div className="admin-table-header">
              <h2>{title}</h2>
              <div className="admin-table-search">
                <input type="text" placeholder="Search RFQs..." />
              </div>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client</th>
                  <th>Description</th>
                  <th>Project Status</th>
                  <th>Submitted Date</th>
                  <th>End Date</th>
                </tr>
              </thead>
              <tbody>
                {rfqs.map((r, i) => (
                  <tr key={i} style={{ cursor: 'pointer' }} onClick={() => navigate(`/rfq/${r.id}?panel=${panel}`, { state: { panel, subcontractor: (location && location.state && location.state.subcontractor) || undefined } })}>
                    <td>{r.id}</td>
                    <td><b>{r.client}</b></td>
                    <td>{r.description.length > 30 ? r.description.slice(0, 30) + '...' : r.description}</td>
                    <td>{r.project_status}</td>
                    <td>{r.submitted}</td>
                    <td>{r.end_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </div>
  );
}
