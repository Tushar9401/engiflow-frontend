import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './AdminDashboard.css';
import './Dashboard.css';
import './RFQComments.css';

// Sample deliverables dataset (keep in sync with ActiveDeliverables until API integration)
const allDeliverables = [
  { id: 'DEL-2026-001', title: 'Foundation Drawings', description: 'Complete foundation drawings and rebar schedules', attachments: [{name:'foundations.pdf', url:'#'}], assigned: ['ABC Constructions'] },
  { id: 'DEL-2026-002', title: 'Reinforcement Layout', description: 'Detailed reinforcement layout for ground floor slab', attachments: [], assigned: ['XYZ Subcontractors', 'ABC Constructions'] },
  { id: 'DEL-2026-003', title: 'Temporary Works', description: 'Shoring and temporary works drawings', attachments: [{name:'shoring.pdf', url:'#'}], assigned: ['SubCo A'] },
];

export default function DeliverableDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const subcontractor = (location && location.state && location.state.subcontractor) ? location.state.subcontractor : null;

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
              <button className="nav-link" onClick={() => navigate('/subcontractor/active-deliverables?subcontractor=' + encodeURIComponent(subcontractor || ''))} style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
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

  // find deliverable by id
  const deliverable = allDeliverables.find(d => String(d.id) === String(id));

  // Comments state (simple local list to mirror RFQDetail)
  const [comments, setComments] = useState([
    { user: 'Admin', text: 'Please review the attached documents.', attachment: null },
    { user: 'Project Manager', text: 'Documents received, will update soon.', attachment: null },
  ]);
  const [commentText, setCommentText] = useState('');
  const [commentFile, setCommentFile] = useState(null);
  const [commentFileUrl, setCommentFileUrl] = useState(null);
  const commentsRef = useRef(null);

  useEffect(() => {
    try {
      if (commentsRef && commentsRef.current) {
        commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
      }
    } catch (e) {}
  }, [comments]);

  function handleFileChange(e) {
    const f = e.target.files && e.target.files[0];
    if (f) {
      setCommentFile(f);
      setCommentFileUrl(URL.createObjectURL(f));
    } else {
      setCommentFile(null);
      setCommentFileUrl(null);
    }
  }

  function handleCommentSubmit(e) {
    e.preventDefault();
    if (!commentText && !commentFile) return;
    setComments(prev => [...prev, { user: 'You', text: commentText, attachment: commentFile ? { name: commentFile.name, url: commentFileUrl } : null }]);
    setCommentText('');
    setCommentFile(null);
    setCommentFileUrl(null);
  }

  function goBack() {
    // Prefer to return to previous page if available
    if (location && location.state && location.state.from) {
      navigate(location.state.from);
      return;
    }
    // fallback to subcontractor active list
    navigate('/subcontractor/active-deliverables');
  }

  if (!deliverable) {
    return (
      <div style={{ padding: 32 }}>
        <button className="btn" onClick={goBack} style={{ marginBottom: 18 }}>&larr; Back</button>
        <h2 style={{ color: '#ef4444' }}>Deliverable not found</h2>
        <p style={{ color: '#6b7280' }}>We couldn't find a deliverable with id <strong>{id}</strong>.</p>
      </div>
    );
  }

  return (
    <div className="rfq-detail-layout" style={{ display: 'flex', gap: '32px', padding: '32px 0', minHeight: '100vh', alignItems: 'flex-start', background: 'linear-gradient(160deg, #f3e8ff 0%, #f8fafc 100%)', width: '100%' }}>
  {renderSubcontractorSidebar()}
  <div style={{ flex: 2, maxWidth: 'none', margin: '0' }}>
        <div style={{ marginBottom: 18 }}>
          <button className="btn" onClick={goBack}>&larr; Back</button>
        </div>
  {/* main content sits directly on the pale-purple gradient (no outer white card) */}
  <div style={{ background: 'transparent', borderRadius: 0, padding: 0, boxShadow: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
            <span style={{ background: '#ede9fe', color: '#6366f1', fontWeight: 700, borderRadius: 8, padding: '6px 12px', fontSize: '0.95rem' }}>{deliverable.id}</span>
            <h1 style={{ margin: '6px 0 0 0', fontSize: '2.6rem', fontWeight: 800 }}>{deliverable.title}</h1>
          </div>

          <div style={{ marginTop: 18, background: '#fff', borderRadius: 12, maxWidth: 760 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 20px', borderRadius: 12, background: '#fff' }}>
              <div style={{ width: 44, height: 44, background: 'rgba(99,102,241,0.08)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📄</div>
              <div>
                <div style={{ fontWeight: 700, color: '#374151', marginBottom: 6 }}>Deliverable Description</div>
                <div style={{ color: '#6b7280', lineHeight: 1.6 }}>{deliverable.description}</div>
              </div>
            </div>
          </div>

          <section style={{ marginTop: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(99,102,241,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📎</div>
                <div style={{ fontWeight: 700, color: '#374151' }}>Attachments</div>
                <div style={{ color: '#9ca3af', marginLeft: 8 }}>{deliverable.attachments ? deliverable.attachments.length + ' Attachments' : '0 Attachments'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {deliverable.attachments && deliverable.attachments.length > 0 ? (
                deliverable.attachments.map((a, i) => (
                  <a key={i} href={a.url} target="_blank" rel="noreferrer" style={{ background: '#f8f5ff', padding: '10px 14px', borderRadius: 10, color: '#5b4fff', textDecoration: 'none' }}>{a.name}</a>
                ))
              ) : (
                <div style={{ color: '#9ca3af' }}>—</div>
              )}
            </div>
          </section>

          {/* Comments panel (use RFQComments.css styles) */}
          <section style={{ marginTop: 22, width: '100%', maxWidth: 800 }}>
            <div className="rfq-comments-panel" style={{ borderRadius: 18, boxShadow: '0 2px 12px 0 rgba(80,80,120,0.06)', padding: '20px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: '1.18rem' }}>Comments</div>
              </div>

              <div ref={commentsRef} className="comments-list" style={{ marginBottom: 12 }}>
                {comments.map((c, i) => (
                  <div key={i} className={`comment-item ${c.user === 'Admin' ? 'admin' : c.user === 'Project Manager' ? 'pm' : 'you'}`}>
                    <div style={{ minWidth: 90, display: 'flex', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="comment-user" style={{ fontWeight: 800, fontSize: '0.96rem', color: c.user === 'Admin' ? '#4c2fc9' : c.user === 'Project Manager' ? '#0ea57a' : '#111827' }}>{c.user}</span>
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="comment-text" style={{ color: '#374151', lineHeight: 1.6, wordBreak: 'break-word' }}>{c.text}</div>
                      <div style={{ marginTop: 8 }}>
                        {c.attachment && c.attachment.url && (
                          <a href={c.attachment.url} target="_blank" rel="noreferrer" style={{ color: '#5b4fff', textDecoration: 'underline', fontSize: '0.98em' }}>{c.attachment.name || 'Attachment'}</a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }} onSubmit={handleCommentSubmit}>
                <textarea className="comment-input" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Add a comment..." style={{ flex: 1, borderRadius: 10, border: '1.2px solid #eef2ff', padding: 14, fontSize: '1.02rem', resize: 'vertical', minHeight: 46 }} />
                <label htmlFor="deliverable-comment-attach" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginRight: 8 }} title="Attach file">
                  <svg width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                    <path d="M7.5 12.5L14.5 5.5M14.5 5.5V10.5M14.5 5.5H9.5" stroke="#5b4fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="3.5" y="3.5" width="15" height="15" rx="4.5" stroke="#5b4fff" strokeWidth="2"/>
                  </svg>
                  <input id="deliverable-comment-attach" type="file" accept="image/*,application/pdf" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>
                <button type="submit" className="comment-post-btn" style={{ background: 'linear-gradient(90deg,#5b4fff,#7c5bff)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 22px', fontWeight: 700, fontSize: '1.02rem', cursor: 'pointer', boxShadow: '0 6px 18px rgba(91,79,255,0.12)' }}>Post</button>
              </form>
            </div>
          </section>
  </div>
  </div>
    </div>
  );
}
