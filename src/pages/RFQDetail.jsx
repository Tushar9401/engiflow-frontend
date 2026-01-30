import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './RFQComments.css';

export default function RFQDetail() {
  const { id } = useParams();
  // Example data, replace with real data or props as needed
  const rfq = {
    id,
    status: 'Pending',
    title: 'Structural Design',
    client: 'Acme Corp',
    service: 'Structural',
    subservice: [
    "Structural Analysis",
    "Beam & Column Design",
    "Foundation Design",
    "Load Calculation",
    "Seismic Analysis",
    "Structural Detailing",
    "Reinforcement Planning",
    "Structural Audit",
    "Retrofitting Design",
    "Steel Structure Design",
    "Concrete Mix Design"
  ],
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
    { user: 'Admin', text: 'Please review the attached documents.', attachment: null, recipient: 'All', time: new Date('2026-01-11T09:30:00').toISOString() },
    { user: 'Project Manager', text: 'Documents received, will update soon.', attachment: null, recipient: 'All', time: new Date('2026-01-11T10:05:00').toISOString() },
  ]);
  const [activeTab, setActiveTab] = useState('comments'); // 'comments' | 'files'
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
  const [newTitle, setNewTitle] = useState('');
  const [newAssignedSubs, setNewAssignedSubs] = useState([]);
  const [newEndDate, setNewEndDate] = useState('');
  const [newAttachment, setNewAttachment] = useState([]);
  const [newAttachmentUrl, setNewAttachmentUrl] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editingDesc, setEditingDesc] = useState('');
  const [editingTitle, setEditingTitle] = useState('');
  const [editingAssigned, setEditingAssigned] = useState([]);
  const [subsOpen, setSubsOpen] = useState(false);
  const subsRef = useRef(null);
  // per-row supplier selection state (temporary before finalizing)
  const [selectedSupplierById, setSelectedSupplierById] = useState({});
  // per-row actions menu open state
  const [openActionsId, setOpenActionsId] = useState(null);

  function toggleActionsMenu(id) {
    setOpenActionsId(prev => prev === id ? null : id);
  }

  function setFinalizedSupplierForRow(id, supplier) {
    setDeliverables(prev => prev.map(d => d.id === id ? ({ ...d, finalizedSupplier: d.finalizedSupplier === supplier ? undefined : supplier }) : d));
  }
  

  function toggleSubcontractorSelection(name) {
    setNewAssignedSubs(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  }

  function handleAddDeliverable() {
    if (!newDesc || !newDesc.trim()) return;
    const d = {
      id: Date.now(),
      title: newTitle || 'Untitled',
      description: newDesc,
      assigned: [...newAssignedSubs],
      end_date: newEndDate || null,
      assigned_date: (newAssignedSubs && newAssignedSubs.length > 0) ? new Date().toISOString() : null,
      attachments: (newAttachment && newAttachment.length > 0) ? newAttachment.map((f, i) => ({ name: f.name, url: newAttachmentUrl[i] || URL.createObjectURL(f), type: f.type })) : []
    };
    setDeliverables(prev => [d, ...prev]);
    setNewDesc('');
    setNewTitle('');
    setNewAssignedSubs([]);
    setNewEndDate('');
    setNewAttachment([]);
    setNewAttachmentUrl([]);
  }

  function handleNewAttachmentChange(e) {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setNewAttachment(files);
      setNewAttachmentUrl(files.map(f => URL.createObjectURL(f)));
    } else {
      setNewAttachment([]);
      setNewAttachmentUrl([]);
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

  function handleSelectSupplier(id, supplier) {
    setSelectedSupplierById(prev => ({ ...prev, [id]: supplier }));
  }

  function finalizeSupplier(id, supplierParam) {
    // allow passing supplier via second arg (used by actions menu) or fall back to selectedSupplierById
    const supplier = supplierParam || selectedSupplierById[id];
    if (!supplier) return;
    setDeliverables(prev => prev.map(d => d.id === id ? ({ ...d, finalizedSupplier: supplier }) : d));
    // Optionally clear the temporary selection (keeps it selected visually)
    // setSelectedSupplierById(prev => { const next = { ...prev }; delete next[id]; return next; });
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
      ,
        time: new Date().toISOString()
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

  // close subcontractor dropdown when clicking outside
  useEffect(() => {
    function onDocClick(e) {
      if (subsRef.current && !subsRef.current.contains(e.target)) {
        setSubsOpen(false);
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

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
              <button className="nav-link" onClick={()=>navigate('/dashboard/request-quotation')} style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
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
  <div className="rfq-detail-layout" style={{ display: 'flex', gap: '32px', padding: '32px 0', minHeight: '100vh', alignItems: 'flex-start', background: 'linear-gradient(160deg, #f3e8ff 0%, #f8fafc 100%)', width: '100%' }}>
      {panel === 'admin' ? renderAdminSidebar() : panel === 'pm' ? renderPMSidebar() : panel === 'subcontractor' ? renderSubcontractorSidebar() : renderDashboardSidebar()}
  <div style={{ flex: 2, maxWidth: 'none', margin: '0' }}>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
        {panel !== 'subcontractor' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
              {/* First row: Client + Dates */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ background: '#f4f4ff', color: '#5b4fff', borderRadius: 20, padding: '7px 18px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
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

              {/* Second row: service + subservices */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ background: '#eef2ff', color: '#3b3dff', borderRadius: 999, padding: '6px 12px', fontWeight: 700, fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  🧭 {rfq.service}
                </span>

                {rfq.subservice && (
                  Array.isArray(rfq.subservice) ? (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                      {rfq.subservice.map((s, idx) => (
                        <span key={idx} style={{ background: '#f8fafc', color: '#374151', borderRadius: 999, padding: '6px 12px', fontWeight: 600, fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                          🔹 {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span style={{ background: '#f8fafc', color: '#374151', borderRadius: 999, padding: '6px 12px', fontWeight: 600, fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      🔹 {rfq.subservice}
                    </span>
                  )
                )}
              </div>
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
          <div style={{width: '100%', maxWidth: 'none', margin: '24px 0', background: '#fff', borderRadius: 18, boxShadow: '0 10px 40px rgba(78,70,255,0.06)', padding: 28, boxSizing: 'border-box'}}>
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
                {/* Add row inputs - vertical layout per design: Title (row 1), Description (row 2), Subcontractors + Attach (row 3) */}
                <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18}}>
                  {/* Row 1: Title */}
                  <div>
                    <div style={{fontSize: '0.9rem', color: '#6b7280', marginBottom: 8}}>Title</div>
                    <input type="text" placeholder="Deliverable title" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{width: '100%', padding: 14, borderRadius: 12, border: '1px solid #eef2ff', fontSize: '1rem', background: '#fff', boxShadow: 'inset 0 1px 0 rgba(16,24,40,0.03)'}} />
                  </div>

                  {/* Row 2: Description */}
                  <div>
                    <div style={{fontSize: '0.9rem', color: '#6b7280', marginBottom: 8}}>Description</div>
                    <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Describe this deliverable in detail…" rows={4} style={{width: '100%', padding: 14, borderRadius: 12, border: '1px solid #eef2ff', resize: 'vertical', fontSize: '1rem', lineHeight: 1.5, background: '#fff', boxShadow: 'inset 0 1px 0 rgba(16,24,40,0.03)'}} />
                  </div>

                  {/* Row 3: Subcontractors (left) and Attach (right) */}
                  <div style={{display: 'flex', gap: 16, alignItems: 'center'}}>
                    <div style={{flex: 1}}>
                      <div style={{fontSize: '0.9rem', color: '#6b7280', marginBottom: 8}}>Subcontractors</div>
                      <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                        <div style={{position: 'relative'}} ref={subsRef}>
                          <button type="button" onClick={() => setSubsOpen(o => !o)} style={{width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 10, border: '1px solid #eef2ff', background: '#fafbff', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8}}>
                            <div style={{display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center'}}>
                              {newAssignedSubs.length === 0 ? (
                                <span style={{color: '#9ca3af'}}>Select subcontractors…</span>
                              ) : (
                                newAssignedSubs.map((s, idx) => (
                                  <span key={idx} style={{background: '#eef2ff', color: '#4c51bf', padding: '6px 10px', borderRadius: 999, fontSize: '0.9rem'}}>{s}</span>
                                ))
                              )}
                            </div>
                            <span style={{opacity: 0.7}}>{subsOpen ? '▴' : '▾'}</span>
                          </button>

                          {subsOpen && (
                            <div style={{position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: '#fff', border: '1px solid #e6e6f8', borderRadius: 10, padding: 8, zIndex: 80, maxHeight: 220, overflowY: 'auto', boxShadow: '0 10px 30px rgba(15,23,42,0.06)'}}>
                              {subcontractors.map((s, i) => (
                                <label key={i} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, cursor: 'pointer'}}>
                                  <input type="checkbox" checked={newAssignedSubs.includes(s)} onChange={() => toggleSubcontractorSelection(s)} />
                                  <span style={{fontSize: '0.95rem'}}>{s}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{flex: '0 0 200px', display: 'flex', flexDirection: 'column', gap: 8}}>
                        <div style={{fontSize: '0.9rem', color: '#6b7280'}}>End Date</div>
                        <input type="date" value={newEndDate} onChange={e => setNewEndDate(e.target.value)} style={{padding: '10px 12px', borderRadius: 10, border: '1px solid #eef2ff', background: '#fff'}} />
                      </div>

                      <div style={{flex: '0 0 260px', display: 'flex', flexDirection: 'column', gap: 8}}>
                        <div style={{fontSize: '0.9rem', color: '#6b7280'}}>Attachments</div>
                      <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                        <label htmlFor="deliverable-attach" style={{display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, background: '#f8f6ff', cursor: 'pointer', border: '1px solid #eef2ff'}}>
                          📎 Attach files
                          <input id="deliverable-attach" type="file" multiple accept="image/*,application/pdf" onChange={handleNewAttachmentChange} style={{display: 'none'}} />
                        </label>
                        <div style={{fontSize: '0.9rem', color: '#6b7280'}}>
                          {newAttachment && newAttachment.length > 0 ? (
                            <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                              {newAttachment.map((f, idx) => (
                                <div key={idx} style={{background: '#f4f4ff', padding: '6px 10px', borderRadius: 8, fontSize: '0.9rem'}}>{f.name}</div>
                              ))}
                            </div>
                          ) : (
                            <div style={{color: '#9ca3af'}}>No files attached</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div style={{overflowX: 'auto'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed'}}>
                    <thead>
                      <tr style={{textAlign: 'left', borderBottom: '1px solid #f0f0ff'}}>
                        <th style={{padding: '10px 8px', fontSize: '0.9rem', width: '18%', borderRight: '1px solid #f3eef9', minWidth: 140}}>Title</th>
                        <th style={{padding: '10px 8px', fontSize: '0.9rem', width: '28%', borderRight: '1px solid #f3eef9', minWidth: 220}}>Description</th>
                        <th style={{padding: '10px 8px', fontSize: '0.9rem', width: '12%', borderRight: '1px solid #f3eef9', minWidth: 120}}>Attachments</th>
                        <th style={{padding: '10px 8px', fontSize: '0.9rem', width: '14%', borderRight: '1px solid #f3eef9', minWidth: 120}}>Subcontractors</th>
                        <th style={{padding: '10px 8px', fontSize: '0.9rem', width: '6%', borderRight: '1px solid #f3eef9', minWidth: 90}}>Assigned Date</th>
                        <th style={{padding: '10px 8px', fontSize: '0.9rem', width: '6%', borderRight: '1px solid #f3eef9', minWidth: 90}}>End Date</th>
                        <th style={{padding: '10px 8px', fontSize: '0.9rem', width: '8%', minWidth: 90}}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliverables.length === 0 && (
                        <tr>
                          <td colSpan={7} style={{padding: 24, color: '#9ca3af'}}>No deliverables yet. Use the form above to add one.</td>
                        </tr>
                      )}
                      {deliverables.map(d => (
                        <tr key={d.id} style={{borderBottom: '1px solid #fbfbff'}}>
                          <td style={{padding: '8px', verticalAlign: 'top', width: '18%', minWidth: 140, maxWidth: 420, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', borderRight: '1px solid #f6f2fb'}}>
                            {editingRowId === d.id ? (
                              <input value={editingTitle} onChange={e => setEditingTitle(e.target.value)} style={{width: '100%', padding: 8}} />
                            ) : (
                              <div style={{fontWeight: 700}}>{d.title}</div>
                            )}
                          </td>
                            <td style={{padding: '8px', verticalAlign: 'top', width: '28%', minWidth: 220, maxWidth: 420, whiteSpace: 'pre-wrap', wordBreak: 'break-word', borderRight: '1px solid #f6f2fb'}}>
                            {editingRowId === d.id ? (
                              <textarea value={editingDesc} onChange={e => setEditingDesc(e.target.value)} rows={3} style={{padding: 8, borderRadius: 8, border: '1px solid #eef2ff', width: '100%', minHeight: 80, resize: 'vertical', fontSize: '1rem'}} />
                            ) : (
                              <div style={{color: '#374151', fontSize: '1rem', lineHeight: 1.5}}>{d.description}</div>
                            )}
                          </td>

                            <td style={{padding: '8px', verticalAlign: 'top', width: '12%', minWidth: 120, maxWidth: 420, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', borderRight: '1px solid #f6f2fb'}}>
                            {d.attachments && d.attachments.length > 0 ? (
                                <div style={{display: 'flex', gap: 8, flexWrap: 'nowrap', alignItems: 'center'}}>
                                  {d.attachments.map((a, idx) => (
                                    <a key={idx} href={a.url} target="_blank" rel="noreferrer" style={{fontSize: '0.88rem', color: '#5b4fff', textDecoration: 'none', background: '#f4f4ff', padding: '6px 8px', borderRadius: 8, display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160}}>
                                      📎 {a.name}
                                    </a>
                                  ))}
                                </div>
                            ) : (
                              <span style={{color: '#9ca3af'}}>—</span>
                            )}
                          </td>
                           

                          <td style={{padding: '8px', verticalAlign: 'top', width: '14%', minWidth: 120, maxWidth: 520, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', borderRight: '1px solid #f6f2fb'}}>
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
                              <div style={{display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center'}}>
                                {(d.assigned && d.assigned.length > 0) ? d.assigned.map((s, idx) => {
                                  const isFinal = d.finalizedSupplier === s;
                                  return (
                                    <button key={idx} title={s} onClick={() => setFinalizedSupplierForRow(d.id, s)} style={{background: isFinal ? '#dcfce7' : '#eef2ff', color: isFinal ? '#166534' : '#4c51bf', padding: '6px 10px', borderRadius: 999, fontSize: '0.9rem', display: 'inline-block', maxWidth: 140, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', border: 'none', cursor: 'pointer'}}>{s}</button>
                                  );
                                }) : <span style={{color: '#9ca3af'}}>Not assigned</span>}
                              </div>
                            )}
                          </td>
                            <td style={{padding: '6px 8px', verticalAlign: 'top', width: '6%', minWidth: 90, textAlign: 'center', borderRight: '1px solid #f6f2fb', fontSize: '0.9rem'}}>
                              {d.assigned_date ? new Date(d.assigned_date).toLocaleDateString() : '—'}
                            </td>

                            <td style={{padding: '6px 8px', verticalAlign: 'top', width: '6%', minWidth: 90, textAlign: 'center', borderRight: '1px solid #f6f2fb', fontSize: '0.9rem'}}>
                              {d.end_date ? new Date(d.end_date).toLocaleDateString() : '—'}
                            </td>
                          
                          <td style={{padding: '8px', verticalAlign: 'top', width: '8%', minWidth: 120, textAlign: 'right'}}>
                            {editingRowId === d.id ? (
                              <div style={{display: 'flex', gap: 8, justifyContent: 'flex-end'}}>
                                <button onClick={() => saveEditRow(d.id)} style={{background: '#5b4fff', color: '#fff', border: 'none', padding: '8px 10px', borderRadius: 8, cursor: 'pointer'}}>Save</button>
                                <button onClick={() => setEditingRowId(null)} style={{background: '#fff', border: '1px solid #e6e6f8', padding: '8px 10px', borderRadius: 8, cursor: 'pointer'}}>Cancel</button>
                              </div>
                            ) : (
                              <div style={{display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end'}}>
                                <button onClick={() => startEditRow(d)} style={{background: '#fff', border: '1px solid #e6e6f8', padding: '6px 10px', borderRadius: 8, cursor: 'pointer', fontSize: '0.95rem'}}>Edit</button>
                                <button onClick={() => deleteDeliverable(d.id)} style={{background: '#fff', border: '1px solid #fde2e2', color: '#b91c1c', padding: '6px 10px', borderRadius: 8, cursor: 'pointer', fontSize: '0.95rem'}}>Delete</button>
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
                        <th style={{padding:'12px 8px', fontSize:'0.95rem', borderRight: '1px solid #f3eef9'}}>Description</th>
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
                            <td style={{padding:12}}>{(d.attachments && d.attachments.length > 0) ? (
                              <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                                {d.attachments.map((a, idx) => (
                                  <a key={idx} href={a.url} target="_blank" rel="noopener noreferrer" style={{color:'#5b4fff', textDecoration:'none', background:'#f4f4ff', padding:'6px 10px', borderRadius:8}}>{a.name}</a>
                                ))}
                              </div>
                            ) : d.attachment ? (
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
          <div className="rfq-comments-panel" style={{borderRadius: 18, boxShadow: '0 2px 12px 0 rgba(80,80,120,0.06)', padding: '20px 22px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{fontWeight: 700, fontSize: '1.18rem'}}>Comments</div>
                <div style={{ display: 'flex', gap: 8, background: 'transparent', padding: 4, borderRadius: 8 }}>
                  <button type="button" onClick={() => setActiveTab('comments')} style={{ padding: '6px 10px', borderRadius: 8, border: 'none', background: activeTab === 'comments' ? 'linear-gradient(90deg,#5b4fff,#7c5bff)' : 'transparent', color: activeTab === 'comments' ? '#fff' : '#6b7280', cursor: 'pointer', fontWeight: 700 }}>Comments</button>
                  <button type="button" onClick={() => setActiveTab('files')} style={{ padding: '6px 10px', borderRadius: 8, border: 'none', background: activeTab === 'files' ? 'linear-gradient(90deg,#5b4fff,#7c5bff)' : 'transparent', color: activeTab === 'files' ? '#fff' : '#6b7280', cursor: 'pointer', fontWeight: 700 }}>Files</button>
                </div>
              </div>
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

            {activeTab === 'comments' ? (
              <div ref={commentsRef} className="comments-list" style={{marginBottom: 18}}>
                {comments.map((c, i) => (
                  <div key={i} className={`comment-item ${c.user === 'Admin' ? 'admin' : c.user === 'Project Manager' ? 'pm' : 'you'}`}>
                    <div style={{minWidth: 90, display: 'flex', alignItems: 'center'}}>
                      <div style={{display: 'flex', flexDirection: 'column'}}>
                        <span className="comment-user" style={{fontWeight: 800, fontSize: '0.96rem', color: c.user === 'Admin' ? '#4c2fc9' : c.user === 'Project Manager' ? '#0ea57a' : '#111827'}}>{c.user}</span>
                        {c.recipient && c.recipient !== 'All' && (
                          <span className="comment-recipient" style={{fontSize: '0.82rem', color: '#6b7280', marginTop: 4}}>to {c.recipient}</span>
                        )}
                      </div>
                    </div>
                    <div className="comment-body" style={{flex: 1, position: 'relative'}}>
                      <div className="comment-text" style={{color: '#374151', lineHeight: 1.6, wordBreak: 'break-word'}}>{c.text}</div>
                      <div style={{marginTop: 8}}>
                        {c.attachment && c.attachment.type && c.attachment.type.startsWith('image') && (
                          <img src={c.attachment.url} alt="comment attachment" className="comment-attachment" style={{maxHeight: 52, borderRadius: 8}} />
                        )}
                        {c.attachment && c.attachment.type === 'application/pdf' && (
                          <a href={c.attachment.url} target="_blank" rel="noopener noreferrer" style={{marginLeft: 0, color: '#5b4fff', textDecoration: 'underline', fontSize: '0.98em'}}>
                            <span role="img" aria-label="pdf">📄</span> {c.attachment.name}
                          </a>
                        )}
                      </div>
                      {c.time && (
                        <div className="comment-time" style={{position: 'absolute', right: 10, bottom: 8, fontSize: '0.82rem', color: '#9ca3af'}}>{new Date(c.time).toLocaleString()}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="comments-list" style={{marginBottom: 18}}>
                {(() => {
                  const files = [];
                  comments.forEach(c => { if (c.attachment && c.attachment.url) files.push({ name: c.attachment.name || 'Attachment', url: c.attachment.url, source: c.user, type: c.attachment.type }); });
                  if (files.length === 0) return <div style={{ color: '#9ca3af' }}>No attached files</div>;
                  return files.map((f, idx) => (
                    <div key={idx} className="comment-item you" style={{ alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(99,102,241,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📎</div>
                      <div style={{ flex: 1 }}>
                        <a href={f.url} target="_blank" rel="noreferrer" style={{ color: '#5b4fff', fontWeight: 700, textDecoration: 'none' }}>{f.name}</a>
                        <div style={{ color: '#6b7280', marginTop: 6, fontSize: '0.95rem' }}>{f.source}</div>
                      </div>
                      <div>
                        <a href={f.url} target="_blank" rel="noreferrer" className="btn" style={{ padding: '8px 10px', borderRadius: 8, background: 'transparent', border: '1px solid #e6e9ff', color: '#5b4fff', textDecoration: 'none' }}>Open</a>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}
            <form style={{display: 'flex', gap: 12, alignItems: 'flex-end'}} onSubmit={handleCommentSubmit}>
              <textarea className="comment-input" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Add a comment..." style={{flex: 1, borderRadius: 10, border: '1.2px solid #eef2ff', padding: 14, fontSize: '1.05rem', resize: 'vertical', minHeight: 46, boxShadow: 'inset 0 1px 0 rgba(16,24,40,0.02)'}} />
              <label htmlFor="comment-attach" style={{cursor: 'pointer', display: 'flex', alignItems: 'center', marginRight: 8}} title="Attach file">
                <svg width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display: 'block'}}>
                  <path d="M7.5 12.5L14.5 5.5M14.5 5.5V10.5M14.5 5.5H9.5" stroke="#5b4fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="3.5" y="3.5" width="15" height="15" rx="4.5" stroke="#5b4fff" strokeWidth="2"/>
                </svg>
                <input id="comment-attach" type="file" accept="image/*,application/pdf" onChange={handleFileChange} style={{display: 'none'}} />
              </label>
              <button type="submit" className="comment-post-btn" style={{background: 'linear-gradient(90deg,#5b4fff,#7c5bff)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 22px', fontWeight: 700, fontSize: '1.02rem', cursor: 'pointer', boxShadow: '0 6px 18px rgba(91,79,255,0.12)'}}>Post</button>
            </form>
          </div>
        </div>
      </div>
      {panel !== 'pm' && (
        <div style={{ flex: 1, maxWidth: 380, position: 'relative' }}>
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 8px 30px rgba(124,58,237,0.06)', padding: 28, marginBottom: 24, minHeight: 220, position: 'sticky', top: 32 }}>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', marginBottom: 12, color: '#12263a' }}>Assign RFQ</div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontWeight: 600, color: '#6b7280', fontSize: '0.95rem', display: 'block', marginBottom: 10 }}>Assign to Project Manager</label>
              <select
                value={selectedPM}
                onChange={e => setSelectedPM(e.target.value)}
                disabled={!!assignedPM}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e6e7ff', fontSize: '1rem', marginBottom: 14, background: '#ffffff' }}
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
                style={{ display: 'block', width: '100%', padding: '12px 14px', borderRadius: 10, background: assignedPM ? 'linear-gradient(90deg,#9aa0ff,#bdaeff)' : 'linear-gradient(90deg,#5b4fff,#7c5bff)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: assignedPM ? 'default' : 'pointer', boxShadow: '0 6px 18px rgba(91,79,255,0.12)' }}
              >
                {assignedPM ? 'Assigned' : 'Assign to Project Manager'}
              </button>

              {assignedPM && (
                <div style={{ marginTop: 12, color: '#374151', fontWeight: 700 }}>
                  Assigned to: {assignedPM}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
