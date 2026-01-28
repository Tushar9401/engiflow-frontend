import React, { useState } from 'react';
import './Dashboard.css';

export default function RequestRFQ() {
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

  function handleRFQSubmit(e) {
    e.preventDefault();
    console.log('Submitting RFQ', { title: rfqTitle, description: rfqDescription, closeDate: rfqCloseDate, files: rfqFiles, serviceType: rfqServiceType, services: rfqSelectedServices, address: { street: rfqStreet, city: rfqCity, state: rfqStateVal, zip: rfqZip, country: rfqCountry } });
    // clear form
    setRfqTitle('');
    setRfqDescription('');
    setRfqFiles(null);
    setRfqCloseDate('');
    setRfqStreet('');
    setRfqCity('');
    setRfqStateVal('');
    setRfqZip('');
    setRfqCountry('');
    setRfqServiceType('Structural');
    setRfqSelectedServices([]);
  }

  function handleFilesChange(e) {
    setRfqFiles(e.target.files);
  }

  return (
    <div style={{ padding: 28 }}>
      <div style={{ borderRadius: 14, padding: 22 }}>
        <h2 style={{ marginTop: 0, color: '#4f46e5' }}>Request for Quotation</h2>
        <form onSubmit={handleRFQSubmit}>
          <div className="rfq-service-section" style={{ marginBottom: 18 }}>
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

          <div style={{marginBottom: 18}}>
            <label style={{display: 'block', fontWeight: 600, color: '#4c1d95', marginBottom: 8}}>Title</label>
            <input value={rfqTitle} onChange={e => setRfqTitle(e.target.value)} type="text" placeholder="Title" style={{width: '100%', padding: '14px', borderRadius: 10, border: '1.5px solid #e6e9ff', fontSize: '1rem'}} />
          </div>

          <div style={{marginBottom: 18}}>
            <label style={{display: 'block', fontWeight: 600, color: '#4c1d95', marginBottom: 8}}>Description</label>
            <textarea value={rfqDescription} onChange={e => setRfqDescription(e.target.value)} placeholder="Description" style={{width: '100%', padding: '14px', borderRadius: 10, border: '1.5px solid #e6e9ff', fontSize: '1rem', minHeight: 120}} />
          </div>

          <div style={{marginBottom: 18}}>
            <label style={{display: 'block', fontWeight: 600, color: '#4c1d95', marginBottom: 8}}>Address</label>
            <input value={rfqStreet} onChange={e => setRfqStreet(e.target.value)} type="text" placeholder="Street address" style={{width: '100%', padding: '12px', borderRadius: 10, border: '1.5px solid #e6e9ff', fontSize: '1rem', marginBottom: 8}} />

            <div style={{display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center'}}>
              <input value={rfqCity} onChange={e => setRfqCity(e.target.value)} type="text" placeholder="City" style={{flex: '1 1 220px', padding: '12px', borderRadius: 10, border: '1.5px solid #e6e9ff', fontSize: '1rem', background: '#fff'}} />
              <input value={rfqStateVal} onChange={e => setRfqStateVal(e.target.value)} type="text" placeholder="State" style={{flex: '0 0 140px', padding: '12px', borderRadius: 10, border: '1.5px solid #e6e9ff', fontSize: '1rem', background: '#fff'}} />
              <select value={rfqCountry} onChange={e => setRfqCountry(e.target.value)} style={{flex: '0 0 200px', padding: '12px', borderRadius: 10, border: '1.5px solid #e6e9ff', fontSize: '1rem', background: '#fff'}}>
                <option value="">Country</option>
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input value={rfqZip} onChange={e => setRfqZip(e.target.value)} type="text" placeholder="ZIP" style={{flex: '0 0 120px', padding: '12px', borderRadius: 10, border: '1.5px solid #e6e9ff', fontSize: '1rem', background: '#fff'}} />
            </div>
          </div>

          <div style={{display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 18, alignItems: 'flex-start'}}>
            <div style={{flex: '1 1 320px'}}>
              <label style={{display: 'block', fontWeight: 600, color: '#4c1d95', marginBottom: 8}}>End Date</label>
              <input type="date" value={rfqCloseDate} onChange={e => setRfqCloseDate(e.target.value)} style={{width: '100%', padding: '12px', borderRadius: 10, border: '1.5px solid #e6e9ff', fontSize: '1rem', background: '#fff'}} />
            </div>

            <div style={{flex: '1 1 320px'}}>
              <label style={{display: 'block', fontWeight: 600, color: '#4c1d95', marginBottom: 8}}>Attachments</label>
              <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                <label htmlFor="rfq-attachments" style={{display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, background: '#f8f6ff', cursor: 'pointer', border: '1px solid #e6e9ff'}}>
                  📎 Choose Files
                </label>
                <div style={{flex: 1, color: '#6b7280'}}>
                  {rfqFiles && rfqFiles.length > 0 ? (
                    <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                      {Array.from(rfqFiles).map((f, i) => (
                        <div key={i} style={{background: '#f4f4ff', padding: '6px 10px', borderRadius: 8, fontSize: '0.9rem'}}>{f.name}</div>
                      ))}
                    </div>
                  ) : (
                    <div style={{color: '#9ca3af'}}>No files chosen</div>
                  )}
                </div>
              </div>
              <input id="rfq-attachments" type="file" accept="image/*,application/pdf" onChange={handleFilesChange} multiple style={{display: 'none'}} />
            </div>
          </div>

          <div style={{display: 'flex', justifyContent: 'flex-end', gap: 12}}>
            <button type="button" className="btn" style={{background: '#eef2ff', color: '#4c1d95'}} onClick={() => {
              // clear
              setRfqTitle(''); setRfqDescription(''); setRfqFiles(null); setRfqCloseDate(''); setRfqStreet(''); setRfqCity(''); setRfqStateVal(''); setRfqZip(''); setRfqCountry(''); setRfqServiceType('Structural'); setRfqSelectedServices([]);
            }}>Cancel</button>
            <button type="submit" className="btn primary">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
