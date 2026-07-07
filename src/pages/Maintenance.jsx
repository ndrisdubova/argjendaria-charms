import { Gem } from 'lucide-react'
import './Maintenance.css'

function Maintenance() {
  return (
    <div className="maintenance-page">
      <div className="maintenance-card">
        <Gem size={34} strokeWidth={1.25} className="maintenance-icon" />
        <span className="eyebrow">Charm's</span>
        <h1>We'll Be Right Back</h1>
        <p>
          Our atelier is currently undergoing some care behind the scenes. We'll be back online
          shortly — thank you for your patience.
        </p>
        <p className="maintenance-contact">
          Rr. Shadervani, Gjilan, Kosova 60000 &nbsp;·&nbsp; +383 048 77 33 88
        </p>
      </div>
    </div>
  )
}

export default Maintenance
