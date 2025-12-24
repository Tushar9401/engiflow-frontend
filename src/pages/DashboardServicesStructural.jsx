import React, { useState } from 'react'
import './Services.css'

const initialStructural = [
  'Structural analysis and design (RCC, steel, composite)',
  'Foundation and substructure design',
  'Seismic and wind load analysis',
  'Structural drawings and detailing',
  'Structural retrofitting and strengthening design',
  'Peer review and structural safety audits',
  'Value engineering and optimization',
]

export default function DashboardServicesStructural(){
  const [selected, setSelected] = useState(new Set())

  function toggle(id){
    setSelected(prev => {
      const next = new Set(prev)
      if(next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="services-content">
      <h2 className="section-heading"><span className="bar" /> Structural Engineering Services</h2>
      <div className="cards-grid">
        {initialStructural.map((t, i) => {
          const id = `struct-${i}`
          const isSelected = selected.has(id)
          return (
            <article key={id} className={`service-card ${isSelected ? 'selected' : ''}`} role="button" tabIndex={0} onClick={() => toggle(id)}>
              <div className="icon-wrap">
                <svg className="check-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <circle cx="12" cy="12" r="10.5" stroke="rgba(99,102,241,0.36)" strokeWidth="2" fill="transparent" />
                </svg>
              </div>
              <div>
                <p className="card-text">{t}</p>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
