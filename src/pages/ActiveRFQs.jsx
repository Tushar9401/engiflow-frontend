import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminDashboard.css';

const rfqs = [
  {
    id: 'RFQ-2024-001',
    client: 'Acme Corp',
    title: 'Structural Design',
    description: 'Structural Design',
    service: 'Structural',
    subservice: 'Structural Analysis',
    project_status: 'In Progress',
    submitted: '2024-12-30',
    end_date: '2026-01-01',
  },
  {
    id: 'RFQ-2024-002',
    client: 'Global Build',
    title: 'Civil Works',
    description: 'Civil Works',
    service: 'Civil',
    subservice: 'Cement Work',
    project_status: 'Bidding',
    submitted: '2024-12-29',
    end_date: '2026-01-01',
  },
  {
    id: 'RFQ-2024-003',
    client: 'Tech Infra',
    title: 'Site Investigation',
    description: 'Site Investigation and concrete testing',
    service: 'Structural',
    subservice: 'Reinforcement Detailing',
    project_status: 'On Hold',
    submitted: '2024-12-28',
    end_date: '2026-01-01',
  },
   {
    id: 'RFQ-2024-001',
    client: 'Acme Corp',
    title: 'Structural Design',
    description: 'Structural Design',
    service: 'Structural',
    subservice: 'Structural Analysis',
    project_status: 'In Progress',
    submitted: '2024-12-30',
    end_date: '2026-01-01',
  },
  {
    id: 'RFQ-2024-002',
    client: 'Global Build',
    title: 'Civil Works',
    description: 'Civil Works',
    service: 'Civil',
    subservice: 'Cement Work',
    project_status: 'Bidding',
    submitted: '2024-12-29',
    end_date: '2026-01-01',
  },
  {
    id: 'RFQ-2024-003',
    client: 'Tech Infra',
    title: 'Site Investigation',
    description: 'Site Investigation and concrete testing',
    service: 'Structural',
    subservice: 'Reinforcement Detailing',
    project_status: 'On Hold',
    submitted: '2024-12-28',
    end_date: '2026-01-01',
  },
   {
    id: 'RFQ-2024-001',
    client: 'Acme Corp',
    title: 'Structural Design',
    description: 'Structural Design',
    service: 'Structural',
    subservice: 'Structural Analysis',
    project_status: 'In Progress',
    submitted: '2024-12-30',
    end_date: '2026-01-01',
  },
  {
    id: 'RFQ-2024-002',
    client: 'Global Build',
    title: 'Civil Works',
    description: 'Civil Works',
    service: 'Civil',
    subservice: 'Cement Work',
    project_status: 'Bidding',
    submitted: '2024-12-29',
    end_date: '2026-01-01',
  },
  {
    id: 'RFQ-2024-003',
    client: 'Tech Infra',
    title: 'Site Investigation',
    description: 'Site Investigation and concrete testing',
    service: 'Structural',
    subservice: 'Reinforcement Detailing',
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

  // Filters & pagination state
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');
  // clientFilter is now a free-text filter (substring match)
  const [clientFilter, setClientFilter] = useState('');
  // sub-service (dependent) filter
  const [subServiceFilter, setSubServiceFilter] = useState('All');
  const [titleFilter, setTitleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Derived lists for filter options
  const clients = useMemo(() => Array.from(new Set(rfqs.map(r => r.client))), []);
  const services = useMemo(() => Array.from(new Set(rfqs.map(r => r.service).filter(Boolean))), []);
  const structuralServices = ['Steel Fabrication', 'Structural Analysis', 'Beam & Column Design', 'Reinforcement Detailing'];
  const civilServices = ['Cement Work', 'Formwork', 'Earthworks', 'Drainage Design'];
  const statuses = useMemo(() => Array.from(new Set(rfqs.map(r => r.project_status).filter(Boolean))), []);

  // Reset page when filters change
  useEffect(() => { setCurrentPage(1); }, [statusFilter, serviceFilter, clientFilter, titleFilter, subServiceFilter]);
  // reset sub-service when the top-level service changes
  useEffect(() => { setSubServiceFilter('All'); }, [serviceFilter]);

  // Apply filters
  const filteredRfqs = useMemo(() => {
    return rfqs.filter(r => {
      if (statusFilter !== 'All' && r.project_status !== statusFilter) return false;
      if (serviceFilter !== 'All' && r.service !== serviceFilter) return false;
      if (subServiceFilter !== 'All' && r.subservice !== subServiceFilter) return false;
      // clientFilter is a substring match (case-insensitive)
      if (clientFilter && !r.client.toLowerCase().includes(clientFilter.toLowerCase())) return false;
      if (titleFilter && !( (r.title || r.description || '').toLowerCase().includes(titleFilter.toLowerCase()) )) return false;
      return true;
    });
  }, [statusFilter, serviceFilter, clientFilter, titleFilter, subServiceFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRfqs.length / pageSize));
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [currentPage, totalPages]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRfqs.slice(start, start + pageSize);
  }, [filteredRfqs, currentPage]);

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
              <button className="nav-link" onClick={()=>navigate('/dashboard/request-quotation')} style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
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
            <div className="admin-table-header" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap'}}>
              <h2 style={{margin: 0}}>{title}</h2>
              <div style={{display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap'}}>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{padding: '8px 10px', borderRadius: 8, border: '1px solid #e6e9ff'}}>
                  <option value="All">All Statuses</option>
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                  <select value={serviceFilter} onChange={e => setServiceFilter(e.target.value)} style={{padding: '8px 10px', borderRadius: 8, border: '1px solid #e6e9ff'}}>
                    <option value="All">All Services</option>
                    {services.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>

                  {serviceFilter !== 'All' && (
                    <select value={subServiceFilter} onChange={e => setSubServiceFilter(e.target.value)} style={{padding: '8px 10px', borderRadius: 8, border: '1px solid #e6e9ff'}}>
                      <option value="All">All {serviceFilter} Services</option>
                      {(serviceFilter === 'Structural' ? structuralServices : civilServices).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  )}
                </div>

                <input value={clientFilter} onChange={e => setClientFilter(e.target.value)} type="text" placeholder="Filter clients (e.g. 'Ac')" style={{padding: '8px 10px', borderRadius: 8, border: '1px solid #e6e9ff'}} />

                <input value={titleFilter} onChange={e => setTitleFilter(e.target.value)} type="text" placeholder="Filter by project title..." style={{padding: '8px 10px', borderRadius: 8, border: '1px solid #e6e9ff'}} />
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
                {paginated.map((r, i) => (
                  <tr key={i} style={{ cursor: 'pointer' }} onClick={() => navigate(`/rfq/${r.id}?panel=${panel}`, { state: { panel, subcontractor: (location && location.state && location.state.subcontractor) || undefined } })}>
                    <td>{r.id}</td>
                    <td><b>{r.client}</b></td>
                    <td>{(r.title || r.description).length > 30 ? (r.title || r.description).slice(0, 30) + '...' : (r.title || r.description)}</td>
                    <td>{r.project_status}</td>
                    <td>{r.submitted}</td>
                    <td>{r.end_date}</td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr><td colSpan={6} style={{textAlign: 'center', padding: 24, color: '#6b7280'}}>No RFQs match the filters.</td></tr>
                )}
              </tbody>
            </table>
            {/* Pagination */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16}}>
              <div style={{color: '#6b7280'}}>Showing {filteredRfqs.length === 0 ? 0 : ( (currentPage-1)*pageSize + 1 )} - {Math.min(currentPage*pageSize, filteredRfqs.length)} of {filteredRfqs.length} results</div>
              <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                <button className="btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p-1))}>Previous</button>
                {[...Array(totalPages)].map((_, idx) => {
                  const p = idx + 1;
                  return (
                    <button key={p} onClick={() => setCurrentPage(p)} className={p === currentPage ? 'btn primary' : 'btn'} style={p === currentPage ? {minWidth: 36} : {minWidth: 36}}>{p}</button>
                  )
                })}
                <button className="btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}>Next</button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
