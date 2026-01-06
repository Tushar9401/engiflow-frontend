import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function RFQDetail() {
  const { id } = useParams();
  // Example data, replace with real data or props as needed
  const rfq = {
    id,
    status: 'Pending',
    title: 'Structural Design',
    client: 'Acme Corp',
    date: 'January 1, 2026',
    end_date: 'January 1, 2026',
    budget: '$12,500',
    priority: 'HIGH',
    clientStatus: 'VERIFIED',
    overview: 'Comprehensive structural design for a 10-story commercial building. The project includes earthquake resistance calculations, load-bearing analysis, and detailed material specifications. Need to adhere to international building codes.',
    attachments: [
      { name: 'Image 1', url: '#' },
      { name: 'Image 2', url: '#' },
      { name: 'Image 3', url: '#' },
      { name: 'Image 4', url: '#' },
    ],
  };

  // Comment state
  const [comments, setComments] = useState([
    { user: 'Admin', text: 'Please review the attached documents.', image: null },
    { user: 'Project Manager', text: 'Documents received, will update soon.', image: null },
  ]);
  const [commentText, setCommentText] = useState('');
  const [commentFile, setCommentFile] = useState(null);
  const [commentFileUrl, setCommentFileUrl] = useState(null);
  // Assignment state: track selected PM and assigned PM
  const [selectedPM, setSelectedPM] = useState('');
  const [assignedPM, setAssignedPM] = useState(null);

  function handleCommentSubmit(e) {
    e.preventDefault();
    if (!commentText && !commentFile) return;
    setComments([
      ...comments,
      {
        user: 'You',
        text: commentText,
        attachment: commentFile
          ? {
              name: commentFile.name,
              url: commentFileUrl,
              type: commentFile.type
            }
          : null
      }
    ]);
    setCommentText('');
    setCommentFile(null);
    setCommentFileUrl(null);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setCommentFile(file);
      setCommentFileUrl(URL.createObjectURL(file));
    }
  }

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  // With HashRouter the query may live inside the hash (e.g. #/rfq/id?panel=dashboard).
  // Parse the hash as a fallback so panel is detected correctly on direct loads/refresh.
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

  function renderAdminSidebar() {
    return (
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
      <aside className="side-nav" style={{ position: 'sticky', top: 0, height: '100vh', alignSelf: 'flex-start', overflow: 'auto', paddingTop: '24px' }}>
        <div className="nav-brand">EngiFlow</div>
        <nav>
          <ul>
            <li className="dashboard-nav-item">
              <button className="nav-link" onClick={()=>navigate('/dashboard')} style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                <span role="img" aria-label="home" style={{marginRight: '8px'}}>🏠</span>Home
              </button>
            </li>
            <li className="dashboard-nav-item">
              <button className="nav-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
               <span role="img" aria-label="clients" style={{marginRight: '8px'}}>📝</span>Request Quotation
              </button>
            </li>
            <li className="dashboard-nav-item">
              <button className="nav-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
                 <span role="img" aria-label="rfqs" style={{marginRight: '8px'}}>📊</span>View Reports
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
    <div className="rfq-detail-layout" style={{ display: 'flex', gap: '32px', padding: '32px 0', minHeight: '100vh', alignItems: 'flex-start' }}>
      {panel === 'admin' ? renderAdminSidebar() : renderDashboardSidebar()}
  <div style={{ flex: 2, maxWidth: '900px', margin: '0' }}>
        <div style={{ marginBottom: '18px', color: '#757575', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.1em', cursor: 'pointer' }} onClick={() => navigate(`/admin/rfqs?panel=${panel}`, { state: { panel } })}>&larr;</span> Back to RFQ Listings
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
          <span style={{ background: '#ede9fe', color: '#6366f1', fontWeight: 600, borderRadius: 8, padding: '4px 16px', fontSize: '1.05rem', letterSpacing: 1 }}>{rfq.id}</span>
          <span style={{ background: '#fff7d6', color: '#bfa100', fontWeight: 600, borderRadius: 8, padding: '4px 14px', fontSize: '1.05rem' }}>{rfq.status}</span>
        </div>
        <h1 style={{ fontSize: '2.6rem', fontWeight: 800, margin: '0 0 18px 0' }}>{rfq.title}</h1>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
          <span style={{ background: '#f4f4ff', color: '#5b4fff', borderRadius: 20, padding: '7px 18px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span role="img" aria-label="client">👤</span> {rfq.client}
          </span>

          <span style={{ background: '#f4f4ff', color: '#5b4fff', borderRadius: 14, padding: '8px 12px', fontWeight: 500, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: 600, letterSpacing: 0.2 }}>Submitted Date</span>
            <span style={{ fontSize: '0.98rem', color: '#5b4fff', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span role="img" aria-label="submitted-date">📅</span>
              {rfq.date}
            </span>
          </span>

          <span style={{ background: '#fff7f0', color: '#b85b00', borderRadius: 14, padding: '8px 12px', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: '0.78rem', color: '#9a7a60', fontWeight: 600, letterSpacing: 0.2 }}>End Date</span>
            <span style={{ fontSize: '0.98rem', color: '#b85b00', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span role="img" aria-label="end-date">⏳</span>
              {rfq.end_date}
            </span>
          </span>
        </div>
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px 0 rgba(80,80,120,0.06)', padding: '28px 32px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ background: '#ede9fe', color: '#5b4fff', borderRadius: 8, padding: '6px 10px', fontSize: '1.3rem', display: 'flex', alignItems: 'center' }}>📄</span>
            <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>Project Description</span>
          </div>
          <div style={{ color: '#444', fontSize: '1.13rem', lineHeight: 1.7 }}>{rfq.overview}</div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ background: '#ede9fe', color: '#5b4fff', borderRadius: 8, padding: '6px 10px', fontSize: '1.3rem', display: 'flex', alignItems: 'center' }}>🖼️</span>
            <span style={{ fontWeight: 700, fontSize: '1.15rem' }}>Submitted Image</span>
            <span style={{ background: '#f4f4ff', color: '#757575', borderRadius: 8, padding: '4px 12px', fontSize: '1rem', marginLeft: 8 }}>{rfq.attachments.length} Attachments</span>
          </div>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            {rfq.attachments.map((doc, i) => (
              <div key={i} style={{ background: '#f9f9ff', borderRadius: 12, padding: '18px 22px', minWidth: 180, fontSize: '1.05rem', color: '#444', display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src="/doc-icon.svg" alt="doc" style={{ width: 28, height: 28 }} />
                {doc.name}
              </div>
            ))}
          </div>
        </div>
        {/* Comment Section - place after main content, below images/docs */}
        <div style={{width: '100%', maxWidth: 800, margin: '48px auto 0 auto'}}>
          <div style={{background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px 0 rgba(80,80,120,0.06)', padding: '28px 32px'}}>
            <div style={{fontWeight: 700, fontSize: '1.18rem', marginBottom: 18}}>Comments</div>
            <div style={{marginBottom: 18}}>
              {comments.map((c, i) => (
                <div key={i} style={{marginBottom: 14}}>
                  <span style={{fontWeight: 600, color: c.user === 'Admin' ? '#5b4fff' : c.user === 'Project Manager' ? '#1dbf73' : '#18181b'}}>{c.user}:</span> {c.text}
                  {c.attachment && c.attachment.type.startsWith('image') && (
                    <img src={c.attachment.url} alt="comment attachment" style={{marginLeft: 10, maxHeight: 40, borderRadius: 6, verticalAlign: 'middle'}} />
                  )}
                  {c.attachment && c.attachment.type === 'application/pdf' && (
                    <a href={c.attachment.url} target="_blank" rel="noopener noreferrer" style={{marginLeft: 10, color: '#5b4fff', textDecoration: 'underline', fontSize: '0.98em'}}>
                      <span role="img" aria-label="pdf">📄</span> {c.attachment.name}
                    </a>
                  )}
                </div>
              ))}
            </div>
            <form style={{display: 'flex', gap: 12, alignItems: 'flex-end'}} onSubmit={handleCommentSubmit}>
              <textarea value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Add a comment..." style={{flex: 1, borderRadius: 8, border: '1.5px solid #e0e7ff', padding: 12, fontSize: '1.05rem', resize: 'vertical', minHeight: 38}} />
              <label htmlFor="comment-attach" style={{cursor: 'pointer', display: 'flex', alignItems: 'center', marginRight: 8}} title="Attach file">
                <svg width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display: 'block'}}>
                  <path d="M7.5 12.5L14.5 5.5M14.5 5.5V10.5M14.5 5.5H9.5" stroke="#5b4fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="3.5" y="3.5" width="15" height="15" rx="4.5" stroke="#5b4fff" strokeWidth="2"/>
                </svg>
                <input id="comment-attach" type="file" accept="image/*,application/pdf" onChange={handleFileChange} style={{display: 'none'}} />
              </label>
              <button type="submit" style={{background: '#5b4fff', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer'}}>Post</button>
            </form>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, maxWidth: 340 }}>
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px 0 rgba(80,80,120,0.06)', padding: '32px 28px', marginBottom: 18 }}>
          <div style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: 18 }}>Assign RFQ</div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontWeight: 500, color: '#757575', fontSize: '1.08rem', display: 'block', marginBottom: 8 }}>Assign to Project Manager:</label>
            <select
              value={selectedPM}
              onChange={e => setSelectedPM(e.target.value)}
              disabled={!!assignedPM}
              style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1.5px solid #e0e7ff', fontSize: '1.05rem', marginBottom: 12 }}
            >
              <option value="">Select Project Manager</option>
              <option value="John Doe">John Doe</option>
              <option value="Jane Smith">Jane Smith</option>
            </select>

            <button
              onClick={() => {
                if (!selectedPM) return;
                setAssignedPM(selectedPM);
              }}
              disabled={!!assignedPM || !selectedPM}
              style={{ background: assignedPM ? '#a3a0f7' : '#5b4fff', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: '1.05rem', cursor: assignedPM ? 'default' : 'pointer', width: '100%' }}
            >
              {assignedPM ? 'Assigned' : 'Assign to Project Manager'}
            </button>

            {assignedPM && (
              <div style={{ marginTop: 12, color: '#374151', fontWeight: 700 }}>
                Assigned to: {assignedPM}
              </div>
            )}
          </div>
          {/* <div style={{ marginBottom: 0 }}>
            <label style={{ fontWeight: 500, color: '#757575', fontSize: '1.08rem', display: 'block', marginBottom: 8 }}>Assign to Sub Contractor:</label>
            <select style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1.5px solid #e0e7ff', fontSize: '1.05rem', marginBottom: 12 }}>
              <option>Select Sub Contractor</option>
              <option>ABC Constructions</option>
              <option>XYZ Subcontractors</option>
            </select>
            <button style={{ background: '#5b4fff', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer', width: '100%' }}>Assign to Sub Contractor</button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
