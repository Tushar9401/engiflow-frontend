import React, { useState } from 'react'
import './Services.css'

const civilServices = [
  'Site investigation and feasibility studies',
  'Earthwork, excavation, and grading planning',
  'Concrete works (PCC, RCC, foundations)',
  'Road, pavement, and drainage design',
  'Water supply, sewerage, and stormwater systems',
  'Quantity estimation and BOQ preparation',
  'Construction supervision and quality control',
]

const structuralServices = [
  'Structural analysis and design (RCC, steel, composite)',
  'Foundation and substructure design',
  'Seismic and wind load analysis',
  'Structural drawings and detailing',
  'Structural retrofitting and strengthening design',
  'Peer review and structural safety audits',
  'Value engineering and optimization',
]

function CheckIcon({ checked }) {
  if (checked) {
    return (
      <svg className="check-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <circle cx="12" cy="12" r="12" fill="var(--accent)" />
        <path d="M7.5 12.5l2.5 2.5L16.5 9.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  return (
    <svg className="check-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="12" cy="12" r="10.5" stroke="rgba(99,102,241,0.36)" strokeWidth="2" fill="transparent" />
    </svg>
  )
}

export default function Services() {
  const [selected, setSelected] = useState(new Set())

  function toggle(service) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(service)) next.delete(service)
      else next.add(service)
      return next
    })
  }

  function handleKeyToggle(e, service) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle(service)
    }
  }

  function requestQuotation() {
    if (selected.size === 0) {
      alert('Please select at least one service to request a quotation.')
      return
    }
    const items = Array.from(selected).map((s, i) => `${i + 1}. ${s}`).join('\n')
    const subject = encodeURIComponent('Request for Quotation - EngiFlow Services')
    const body = encodeURIComponent(`Hello,%0D%0A%0D%0AI would like to request a quotation for the following services:%0D%0A%0D%0A${items}%0D%0A%0D%0ARegards,`)
    // open user's mail client with prefilled subject and body
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <div className="services-bg">
      <main className="services-page">
      <header className="services-hero">
        <h1 className="services-title">Our <span>Services</span></h1>
        <p className="services-lead">Comprehensive engineering solutions tailored to meet your project needs. From civil infrastructure to structural design, we deliver excellence.</p>
      </header>

      <section className="services-section">
        <h2 className="section-heading"><span className="bar" /> Civil Engineering Services</h2>

        <div className="cards-grid">
          {civilServices.map((s, i) => {
            const isSelected = selected.has(s)
            return (
              <article
                className={`service-card ${isSelected ? 'selected' : ''}`}
                key={i}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => toggle(s)}
                onKeyDown={e => handleKeyToggle(e, s)}
              >
                  <div className="icon-wrap"><CheckIcon checked={isSelected} /></div>
                <p className="card-text">{s}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="services-section">
        <h2 className="section-heading"><span className="bar" /> Structural Engineering Services</h2>

        <div className="cards-grid">
          {structuralServices.map((s, i) => {
            const isSelected = selected.has(s)
            return (
              <article
                className={`service-card ${isSelected ? 'selected' : ''}`}
                key={i}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => toggle(s)}
                onKeyDown={e => handleKeyToggle(e, s)}
              >
                <div className="icon-wrap"><CheckIcon checked={isSelected} /></div>
                <p className="card-text">{s}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="rfq-panel">
        <div className="rfq-content">
          <h3 className="rfq-heading">Ready to start your project?</h3>
          <p className="rfq-sub">You have selected {selected.size} service{selected.size !== 1 ? 's' : ''}. Click below to proceed with your quotation request.</p>

          <div className="rfq-box">
            <div className="rfq-box-title">Selected Services:</div>
            <div className="rfq-pills">
              {Array.from(selected).length === 0 && <span className="rfq-empty">No services selected</span>}
              {Array.from(selected).map((s, i) => (
                <span className="rfq-pill" key={i}>{s}</span>
              ))}
            </div>
          </div>

          <div className="rfq-actions">
            <button className="request-btn" onClick={requestQuotation}>Request for Quotation</button>
          </div>
        </div>
      </section>
      </main>
    </div>
  )
}
