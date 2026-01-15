import React, { useState, useEffect, useRef } from 'react';
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
    // sample deliverables created by the Project Manager and saved on the RFQ
    deliverables: [
      {
        id: 'DEL-2026-001',
        title: 'Sample Deliverable',
        description: 'dsdasd',
        assigned: ['ABC Constructions', 'XYZ Subcontractors'],
        attachment: { name: 'Screenshot 2026-01-11 at 12.54.00 AM.png', url: '#', type: 'image/png' }
      }
    ],
  };

  // Comment state
  const [comments, setComments] = useState([
    { user: 'Admin', text: 'Please review the attached documents.', attachment: null, recipient: 'All' },
    { user: 'Project Manager', text: 'Documents received, will update soon.', attachment: null, recipient: 'All' },
  ]);
  const [commentText, setCommentText] = useState('');
  const [commentFile, setCommentFile] = useState(null);
  const [commentFileUrl, setCommentFileUrl] = useState(null);
  const commentsRef = useRef(null);
  const [commentRecipient, setCommentRecipient] = useState('All');
  // Assignment state: track selected PM and assigned PM
  const [selectedPM, setSelectedPM] = useState('');
  const [assignedPM, setAssignedPM] = useState(null);

  // Deliverables state for Project Manager view
  const subcontractors = ['ABC Constructions', 'XYZ Subcontractors', 'SubCo A'];
  const [deliverables, setDeliverables] = useState([]);
  const [newDesc, setNewDesc] = useState('');
  const [newAssignedSubs, setNewAssignedSubs] = useState([]);
  const [newAttachment, setNewAttachment] = useState(null);
  const [newAttachmentUrl, setNewAttachmentUrl] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editingDesc, setEditingDesc] = useState('');
  const [editingAssigned, setEditingAssigned] = useState([]);
  

  function toggleSubcontractorSelection(name) {
    setNewAssignedSubs(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  }

  function handleAddDeliverable() {
    if (!newDesc || !newDesc.trim()) return;
    const d = {
      id: Date.now(),
      description: newDesc,
      assigned: [...newAssignedSubs],
      attachment: newAttachment ? { name: newAttachment.name, url: newAttachmentUrl, type: newAttachment.type } : null
    };
    setDeliverables(prev => [d, ...prev]);
    setNewDesc('');
    setNewAssignedSubs([]);
    setNewAttachment(null);
    setNewAttachmentUrl(null);
  }

  function handleNewAttachmentChange(e) {
    const file = e.target.files[0];
    if (file) {
      setNewAttachment(file);
      setNewAttachmentUrl(URL.createObjectURL(file));
    }
  }

  function startEditRow(d) {
    setEditingRowId(d.id);
    setEditingDesc(d.description || '');
    setEditingAssigned(d.assigned ? [...d.assigned] : []);
  }

  function toggleEditingAssigned(name) {
    setEditingAssigned(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  }

  function saveEditRow(id) {
    setEditingRowId(null);
    setEditingDesc('');
    setEditingAssigned([]);
  }

  function deleteDeliverable(id) {
    // wrapper for removeDeliverable to keep naming intuitive
    removeDeliverable(id);
  }

  function removeDeliverable(id) {
    setDeliverables(prev => prev.filter(d => d.id !== id));
  }

  function toggleDeliverableAssignment(id, name) {
    setDeliverables(prev => prev.map(d => {
      if (d.id !== id) return d;
      const assigned = d.assigned || [];
      return {
        ...d,
        assigned: assigned.includes(name) ? assigned.filter(n => n !== name) : [...assigned, name]
      };
    }));
  }

  function handleCommentSubmit(e) {
    e.preventDefault();
    if (!commentText && !commentFile) return;
    setComments([
      ...comments,
      {
        user: 'You',
        text: commentText,
        recipient: commentRecipient,
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

  // Auto-scroll comments container to bottom when comments change
  useEffect(() => {
    try {
      if (commentsRef && commentsRef.current) {
        commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
      }
    } catch (e) {
      // ignore in case of SSR or missing DOM
    }
  }, [comments]);

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

  function renderPMSidebar() {
    return (
      <aside className="side-nav" style={{ position: 'sticky', top: 0, height: '100vh', alignSelf: 'flex-start', overflow: 'auto', paddingTop: '24px' }}>
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
      <aside className="side-nav" style={{ position: 'sticky', top: 0, height: '100vh', alignSelf: 'flex-start', overflow: 'auto', paddingTop: '24px' }}>
        <div className="nav-brand">EngiFlow</div>
        <nav>
          <ul>
            <li className="dashboard-nav-item">
              <button className="nav-link" onClick={()=>navigate('/subcontractor')} style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
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

  const subcontractor = (location && location.state && location.state.subcontractor) ? location.state.subcontractor : null;
  // Deliverables source: prefer deliverables stored on the RFQ (PM view) then local runtime deliverables.
  // This lets a subcontractor opening the RFQDetail see items the Project Manager added on the RFQ.
  const sourceDeliverables = [ ...(rfq.deliverables || []), ...deliverables ];
  // deliverables assigned to the current subcontractor (if any)
  const assignedDeliverables = sourceDeliverables.filter(d => d && d.assigned && subcontractor && d.assigned.includes(subcontractor));

  return (
    <div className="rfq-detail-layout" style={{ display: 'flex', gap: '32px', padding: '32px 0', minHeight: '100vh', alignItems: 'flex-start' }}>
      {panel === 'admin' ? renderAdminSidebar() : panel === 'pm' ? renderPMSidebar() : panel === 'subcontractor' ? renderSubcontractorSidebar() : renderDashboardSidebar()}
  <div style={{ flex: 2, maxWidth: '900px', margin: '0' }}>
        <div style={{ marginBottom: '18px', color: '#757575', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.1em', cursor: 'pointer' }} onClick={() => navigate(`/admin/rfqs?panel=${panel}`, { state: { panel } })}>&larr;</span> Back to RFQ Listings
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
          <span style={{ background: '#ede9fe', color: '#6366f1', fontWeight: 600, borderRadius: 8, padding: '4px 16px', fontSize: '1.05rem', letterSpacing: 1 }}>{rfq.id}</span>
          {panel !== 'subcontractor' && (
            <span style={{ background: '#fff7d6', color: '#bfa100', fontWeight: 600, borderRadius: 8, padding: '4px 14px', fontSize: '1.05rem' }}>{rfq.status}</span>
          )}
        </div>
        <h1 style={{ fontSize: '2.6rem', fontWeight: 800, margin: '0 0 18px 0' }}>{rfq.title}</h1>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
        {panel !== 'subcontractor' && (
          <>
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
          </>
        )}
        </div>
        {panel !== 'subcontractor' && (
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px 0 rgba(80,80,120,0.06)', padding: '28px 32px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ background: '#ede9fe', color: '#5b4fff', borderRadius: 8, padding: '6px 10px', fontSize: '1.3rem', display: 'flex', alignItems: 'center' }}>📄</span>
              <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>Project Description</span>
            </div>
            <div style={{ color: '#444', fontSize: '1.13rem', lineHeight: 1.7 }}>{rfq.overview}</div>
          </div>
        )}
        {panel !== 'subcontractor' && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
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
        )}
        {/* Deliverables table - PM sees full manager view, subcontractor sees only assigned items */}
        {(panel === 'pm' || panel === 'subcontractor') && (
          <div style={{width: '100%', maxWidth: 900, margin: '24px auto', background: '#fff', borderRadius: 18, boxShadow: '0 6px 30px rgba(78,70,255,0.08)', padding: 20}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
              <div>
                <div style={{fontWeight: 800, fontSize: '1.2rem'}}>Deliverables</div>
                {panel === 'pm' && <div style={{color: '#6b7280', fontSize: '0.95rem'}}>Add deliverables and assign each item to one or more subcontractors.</div>}
              </div>
              <div style={{display: 'flex', gap: 8}}>
                {panel === 'pm' && <button onClick={handleAddDeliverable} style={{background: 'linear-gradient(90deg,#5b4fff,#7c5bff)', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 10, fontWeight: 700, cursor: 'pointer'}}>Add Deliverable</button>}
              </div>
            </div>

            {/* Add row inputs and table shown only to PMs - subcontractor sees assigned items only below */}
            {panel === 'pm' && (
              <>
                {/* Add row inputs */}
                <div style={{display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, marginBottom: 18, alignItems: 'start'}}>
                  <textarea
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    placeholder="Description"
                    rows={6}
                    style={{padding: 18, borderRadius: 12, border: '1px solid #eef2ff', minHeight: 200, resize: 'vertical', fontSize: '1rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}
                  />

                  <div style={{display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end'}}>
                    <label htmlFor="deliverable-attach" style={{display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 10, background: newAttachment ? '#eef2ff' : '#f8fafc', cursor: 'pointer', border: '1px solid #eef2ff', fontSize: '0.95rem'}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#5b4fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 10l5-5 5 5" stroke="#5b4fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span style={{fontSize: '0.95rem'}}>{newAttachment ? newAttachment.name : 'Attach'}</span>
                      <input id="deliverable-attach" type="file" accept="image/*,application/pdf" onChange={handleNewAttachmentChange} style={{display: 'none'}} />
                    </label>

                      <div style={{display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end'}}>
                        {subcontractors.map((s, i) => (
                          <button key={i} onClick={() => toggleSubcontractorSelection(s)} style={{background: newAssignedSubs.includes(s) ? '#eef2ff' : '#f8fafc', border: '1px solid #eef2ff', padding: '8px 12px', borderRadius: 999, cursor: 'pointer', fontSize: '0.95rem'}}>{s}</button>
                        ))}
                      </div>
                  </div>
                </div>

                {/* Table */}
                <div style={{overflow: 'auto'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                      <tr style={{textAlign: 'left', borderBottom: '1px solid #f0f0ff'}}>
                        <th style={{padding: '12px 8px', fontSize: '0.95rem'}}>Description</th>
                        <th style={{padding: '12px 8px', fontSize: '0.95rem'}}>Attachment</th>
                        <th style={{padding: '12px 8px', fontSize: '0.95rem'}}>Assigned Subcontractors</th>
                        <th style={{padding: '12px 8px', fontSize: '0.95rem', width: 150}}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliverables.length === 0 && (
                        <tr>
                          <td colSpan={4} style={{padding: 18, color: '#9ca3af'}}>No deliverables yet. Use the form above to add one.</td>
                        </tr>
                      )}
                      {deliverables.map(d => (
                        <tr key={d.id} style={{borderBottom: '1px solid #fbfbff'}}>
                          <td style={{padding: 12, verticalAlign: 'top', maxWidth: '100%', whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
                            {editingRowId === d.id ? (
                              <textarea value={editingDesc} onChange={e => setEditingDesc(e.target.value)} rows={4} style={{padding: 8, borderRadius: 8, border: '1px solid #eef2ff', width: '100%', minHeight: 120, resize: 'vertical', fontSize: '1rem'}} />
                            ) : (
                              <div style={{color: '#374151', fontSize: '1rem', lineHeight: 1.5}}>{d.description}</div>
                            )}
                          </td>
                          <td style={{padding: 12, verticalAlign: 'top'}}>
                            {d.attachment ? (
                              <a href={d.attachment.url} target="_blank" rel="noopener noreferrer" style={{fontSize: '0.95rem', color: '#5b4fff', textDecoration: 'none', background: '#f4f4ff', padding: '6px 10px', borderRadius: 8}}>
                                {d.attachment.name}
                              </a>
                            ) : (
                              <span style={{color: '#9ca3af'}}>—</span>
                            )}
                          </td>
                          <td style={{padding: 12, verticalAlign: 'top'}}>
                            {editingRowId === d.id ? (
                              <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                                {subcontractors.map((s, i) => (
                                  <label key={i} style={{display: 'flex', alignItems: 'center', gap: 8, background: editingAssigned.includes(s) ? '#eef2ff' : '#f8fafc', padding: '6px 10px', borderRadius: 8, cursor: 'pointer'}}>
                                    <input type="checkbox" checked={editingAssigned.includes(s)} onChange={() => toggleEditingAssigned(s)} />
                                    <span style={{fontSize: '0.95rem'}}>{s}</span>
                                  </label>
                                ))}
                              </div>
                            ) : (
                              <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                                {(d.assigned && d.assigned.length > 0) ? d.assigned.map((s, idx) => (
                                  <span key={idx} style={{background: '#eef2ff', color: '#4c51bf', padding: '6px 10px', borderRadius: 999, fontSize: '0.9rem'}}>{s}</span>
                                )) : <span style={{color: '#9ca3af'}}>Not assigned</span>}
                              </div>
                            )}
                          </td>
                          <td style={{padding: 12, verticalAlign: 'top'}}>
                            {editingRowId === d.id ? (
                              <div style={{display: 'flex', gap: 8}}>
                                <button onClick={() => saveEditRow(d.id)} style={{background: '#5b4fff', color: '#fff', border: 'none', padding: '8px 10px', borderRadius: 8, cursor: 'pointer'}}>Save</button>
                                <button onClick={() => setEditingRowId(null)} style={{background: '#fff', border: '1px solid #e6e6f8', padding: '8px 10px', borderRadius: 8, cursor: 'pointer'}}>Cancel</button>
                              </div>
                            ) : (
                              <div style={{display: 'flex', gap: 8}}>
                                <button onClick={() => startEditRow(d)} style={{background: '#fff', border: '1px solid #e6e6f8', padding: '8px 10px', borderRadius: 8, cursor: 'pointer'}}>Edit</button>
                                <button onClick={() => deleteDeliverable(d.id)} style={{background: '#fff', border: '1px solid #fde2e2', color: '#b91c1c', padding: '8px 10px', borderRadius: 8, cursor: 'pointer'}}>Delete</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Subcontractor view: show only deliverables assigned to them */}
            {panel === 'subcontractor' && (
              <div style={{paddingTop: 6}}>
                <div style={{fontWeight:700, marginBottom:12}}>Assigned Deliverables</div>
                <div style={{overflow:'auto'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                      <tr style={{textAlign:'left', borderBottom:'1px solid #f0f0ff'}}>
                        <th style={{padding:'12px 8px', fontSize:'0.95rem'}}>Description</th>
                        <th style={{padding:'12px 8px', fontSize:'0.95rem'}}>Attachment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignedDeliverables.length === 0 ? (
                        // Fallback: show the RFQ as a single helpful row (description + RFQ-level attachment)
                        <tr style={{borderBottom:'1px solid #fbfbff'}}>
                          <td style={{padding:12}}><div style={{whiteSpace:'pre-wrap',lineHeight:1.6,color:'#374151'}}>{rfq.overview}</div></td>
                          <td style={{padding:12}}>{(rfq.attachments && rfq.attachments.length > 0) ? (
                            <a href={rfq.attachments[0].url} target="_blank" rel="noopener noreferrer" style={{color:'#5b4fff', textDecoration:'none', background:'#f4f4ff', padding:'6px 10px', borderRadius:8}}>{rfq.attachments[0].name}</a>
                          ) : <span style={{color:'#9ca3af'}}>—</span>}</td>
                        </tr>
                      ) : (
                        assignedDeliverables.map(d => (
                          <tr key={d.id} style={{borderBottom:'1px solid #fbfbff'}}>
                            <td style={{padding:12}}><div style={{whiteSpace:'pre-wrap',lineHeight:1.6,color:'#374151'}}>{d.description}</div></td>
                            <td style={{padding:12}}>{d.attachment ? (
                              <a href={d.attachment.url} target="_blank" rel="noopener noreferrer" style={{color:'#5b4fff', textDecoration:'none', background:'#f4f4ff', padding:'6px 10px', borderRadius:8}}>{d.attachment.name}</a>
                            ) : <span style={{color:'#9ca3af'}}>—</span>}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Comment Section - moved below deliverables */}
        <div style={{width: '100%', maxWidth: 800, margin: '24px auto 0 auto'}}>
          <div style={{background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px 0 rgba(80,80,120,0.06)', padding: '28px 32px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
              <div style={{fontWeight: 700, fontSize: '1.18rem'}}>Comments</div>
              {(panel === 'admin' || panel === 'pm') && (
                <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                  <label htmlFor="comment-recipient" style={{fontSize: '0.95rem', color: '#6b7280'}}>Send to</label>
                  <select id="comment-recipient" value={commentRecipient} onChange={e => setCommentRecipient(e.target.value)} style={{padding: '8px 10px', borderRadius: 8, border: '1px solid #e6e6f8'}}>
                    <option value="All">All</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Client">Client</option>
                    {subcontractors.map((s, idx) => (
                      <option key={idx} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div ref={commentsRef} style={{marginBottom: 18, maxHeight: 240, overflowY: 'auto', paddingRight: 8}}>
              {comments.map((c, i) => (
                <div key={i} style={{marginBottom: 14}}>
                  <span style={{fontWeight: 600, color: c.user === 'Admin' ? '#5b4fff' : c.user === 'Project Manager' ? '#1dbf73' : '#18181b'}}>{c.user}:</span>
                  <span style={{marginLeft: 8}}>{c.text}</span>
                  {c.recipient && c.recipient !== 'All' && (
                    <span style={{marginLeft: 10, fontSize: '0.9rem', color: '#6b7280'}}>(to {c.recipient})</span>
                  )}
                  {c.attachment && c.attachment.type && c.attachment.type.startsWith('image') && (
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
