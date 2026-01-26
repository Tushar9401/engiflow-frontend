import React, { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import './Dashboard.css'

export default function DashboardLayout() {
  const [showRFQModal, setShowRFQModal] = useState(false);
  const [rfqTitle, setRfqTitle] = useState('');
  const [rfqDescription, setRfqDescription] = useState('');
  const [rfqFiles, setRfqFiles] = useState(null);
  const [rfqCloseDate, setRfqCloseDate] = useState('');
  const [rfqStreet, setRfqStreet] = useState('');
  const [rfqCity, setRfqCity] = useState('');
  const [rfqStateVal, setRfqStateVal] = useState('');
  const [rfqZip, setRfqZip] = useState('');
  const [rfqCountry, setRfqCountry] = useState('');
  const [rfqServiceType, setRfqServiceType] = useState('Structural');
  const structuralServices = ['Steel Fabrication', 'Structural Analysis', 'Beam & Column Design', 'Reinforcement Detailing'];
  const civilServices = ['Cement Work', 'Formwork', 'Earthworks', 'Drainage Design'];
  const [rfqSelectedServices, setRfqSelectedServices] = useState([]);
  const countries = [
    'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia','Austria','Azerbaijan',
    'Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi',
    'Cabo Verde','Cambodia','Cameroon','Canada','Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo, Republic of the','Congo, Democratic Republic of the','Costa Rica','Cote d\'Ivoire','Croatia','Cuba','Cyprus','Czech Republic',
    'Denmark','Djibouti','Dominica','Dominican Republic',
    'Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia',
    'Fiji','Finland','France',
    'Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana',
    'Haiti','Honduras','Hungary',
    'Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy',
    'Jamaica','Japan','Jordan',
    'Kazakhstan','Kenya','Kiribati','Korea, North','Korea, South','Kosovo','Kuwait','Kyrgyzstan',
    'Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg',
    'Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar',
    'Namibia','Nauru','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Macedonia','Norway',
    'Oman',
    'Pakistan','Palau','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal',
    'Qatar',
    'Romania','Russia','Rwanda',
    'Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino','Sao Tome and Principe','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa','Spain','Sri Lanka','Sudan','Suriname','Sweden','Switzerland','Syria',
    'Taiwan','Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu',
    'Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan',
    'Vanuatu','Vatican City','Venezuela','Vietnam',
    'Yemen','Zambia','Zimbabwe'
  ];

  function openRFQModal() {
    setShowRFQModal(true);
  }

  function closeRFQModal() {
    setShowRFQModal(false);
    setRfqTitle('');
    setRfqDescription('');
    setRfqFiles(null);
    setRfqCloseDate('');
    setRfqStreet('');
    setRfqCity('');
    setRfqStateVal('');
    setRfqZip('');
    setRfqServiceType('Structural');
    setRfqSelectedServices([]);
    setRfqCountry('');
  }

  function handleRFQSubmit(e) {
    e.preventDefault();
    // For now just close the modal. Replace with API call as needed.
    console.log('Submitting RFQ', { title: rfqTitle, description: rfqDescription, closeDate: rfqCloseDate, files: rfqFiles, serviceType: rfqServiceType, services: rfqSelectedServices, address: { street: rfqStreet, city: rfqCity, state: rfqStateVal, zip: rfqZip, country: rfqCountry } });
    closeRFQModal();
  }

  function handleFilesChange(e) {
    setRfqFiles(e.target.files);
  }
  const navigate = useNavigate()
  React.useEffect(() => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="dashboard-layout">
      <aside className="side-nav">
        <div className="nav-brand">EngiFlow</div>
        <nav>
          <ul>
                {/* <li className="dashboard-nav-item dashboard-nav-home topnav-home">
                  <NavLink to="/dashboard" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}><span role="img" aria-label="home" style={{marginRight: '8px'}}>🏠</span>Home</NavLink>
                </li> */}
                <li className="dashboard-nav-item">
                  <button className="nav-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}} onClick={() => {/* TODO: Implement action */}}>
                    <span role="img" aria-label="quote" style={{marginRight: '8px'}}>🏠</span>Home
                  </button>
                </li>
                <li className="dashboard-nav-item">
                  <button className="nav-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer'}} onClick={openRFQModal}>
                    <span role="img" aria-label="quote" style={{marginRight: '8px'}}>📝</span>Request Quotation
                  </button>
                </li>
                {/* View Reports moved to Admin sidebar per UX change */}
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

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1 className="welcome">Welcome back, <span>Client</span></h1>
            <p className="lead">Here's your project overview and activity</p>
          </div>

          <div className="header-actions">
            {/* <button className="btn primary">+ New Project</button> */}
            {/* <button className="btn secondary" onClick={() => { navigate('/dashboard/civil') }}>View Services</button> */}
          </div>
        </header>

        <div className="dashboard-outlet">
          <Outlet />
        </div>
      </main>

      {showRFQModal && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999}}>
          <div style={{width: '92%', maxWidth: 1100, background: '#fff', borderRadius: 14, padding: 28, boxShadow: '0 20px 60px rgba(15,23,42,0.25)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18}}>
              <h2 style={{margin: 0, color: '#4f46e5'}}>Request for Quotation</h2>
              <button onClick={closeRFQModal} style={{background: 'transparent', border: 'none', fontSize: 20, cursor: 'pointer'}}>✕</button>
            </div>

            <form onSubmit={handleRFQSubmit}>
              {/* Service selection (top) */}
              <div className="rfq-service-section">
                <label className="rfq-service-label">Service Type</label>
                <div className="rfq-service-type-row">
                  <div className="rfq-type-select">
                    <select value={rfqServiceType} onChange={e => setRfqServiceType(e.target.value)} className="rfq-type-select-input">
                      <option value="Structural">Structural</option>
                      <option value="Civil">Civil</option>
                    </select>
                  </div>
                </div>

                <div className="rfq-service-pills">
                  {(rfqServiceType === 'Structural' ? structuralServices : civilServices).map(s => {
                    const checked = rfqSelectedServices.includes(s);
                    return (
                      <label key={s} className={"rfq-service-pill" + (checked ? ' checked' : '')}>
                        <input type="checkbox" checked={checked} onChange={(e) => {
                          if (e.target.checked) setRfqSelectedServices(prev => [...prev, s]);
                          else setRfqSelectedServices(prev => prev.filter(x => x !== s));
                        }} />
                        <span className="rfq-service-pill-text">{s}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Title */}
              <div style={{marginBottom: 18}}>
                <label style={{display: 'block', fontWeight: 600, color: '#4c1d95', marginBottom: 8}}>Title</label>
                <input value={rfqTitle} onChange={e => setRfqTitle(e.target.value)} type="text" placeholder="Title" style={{width: '100%', padding: '14px', borderRadius: 10, border: '1.5px solid #e6e9ff', fontSize: '1rem'}} />
              </div>

              {/* Description */}
              <div style={{marginBottom: 18}}>
                <label style={{display: 'block', fontWeight: 600, color: '#4c1d95', marginBottom: 8}}>Description</label>
                <textarea value={rfqDescription} onChange={e => setRfqDescription(e.target.value)} placeholder="Description" style={{width: '100%', padding: '14px', borderRadius: 10, border: '1.5px solid #e6e9ff', fontSize: '1rem', minHeight: 120}} />
              </div>

              {/* Address */}
              <div style={{marginBottom: 18}}>
                <label style={{display: 'block', fontWeight: 600, color: '#4c1d95', marginBottom: 8}}>Address</label>
                <input value={rfqStreet} onChange={e => setRfqStreet(e.target.value)} type="text" placeholder="Street address" style={{width: '100%', padding: '12px', borderRadius: 10, border: '1.5px solid #e6e9ff', fontSize: '1rem', marginBottom: 8}} />

                <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                  <input value={rfqCity} onChange={e => setRfqCity(e.target.value)} type="text" placeholder="City" style={{flex: '1 1 160px', padding: '12px', borderRadius: 10, border: '1.5px solid #e6e9ff', fontSize: '1rem'}} />
                  <input value={rfqStateVal} onChange={e => setRfqStateVal(e.target.value)} type="text" placeholder="State" style={{flex: '0 0 120px', padding: '12px', borderRadius: 10, border: '1.5px solid #e6e9ff', fontSize: '1rem'}} />
                  <input value={rfqZip} onChange={e => setRfqZip(e.target.value)} type="text" placeholder="ZIP" style={{flex: '0 0 120px', padding: '12px', borderRadius: 10, border: '1.5px solid #e6e9ff', fontSize: '1rem'}} />
                </div>
                <div style={{marginTop: 8}}>
                  <select value={rfqCountry} onChange={e => setRfqCountry(e.target.value)} style={{width: '100%', padding: '12px', borderRadius: 10, border: '1.5px solid #e6e9ff', fontSize: '1rem'}}>
                    <option value="">Country</option>
                    {countries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Expected Close Date */}
              <div style={{marginBottom: 18}}>
                <label style={{display: 'block', fontWeight: 600, color: '#4c1d95', marginBottom: 8}}>End Date</label>
                <input type="date" value={rfqCloseDate} onChange={e => setRfqCloseDate(e.target.value)} style={{width: '100%', padding: '12px', borderRadius: 10, border: '1.5px solid #e6e9ff', fontSize: '1rem'}} />
              </div>

              {/* Images / Files */}
              <div style={{marginBottom: 24}}>
                <label style={{display: 'block', fontWeight: 600, color: '#4c1d95', marginBottom: 8}}>Attachments</label>
                <input type="file" accept="image/*,application/pdf" onChange={handleFilesChange} multiple style={{width: '100%', padding: '12px', borderRadius: 8, border: '1.5px solid #e6e9ff', background: '#fafbff'}} />
              </div>

              <div style={{display: 'flex', justifyContent: 'flex-end', gap: 12}}>
                <button type="button" onClick={closeRFQModal} className="btn" style={{background: '#eef2ff', color: '#4c1d95'}}>Cancel</button>
                <button type="submit" className="btn primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
