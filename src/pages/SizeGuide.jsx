import { Link } from 'react-router-dom'
import { Ruler, Gem } from 'lucide-react'
import { SIZE_CHART } from '../data/ringSizes'
import './SizeGuide.css'

function SizeGuide() {
  return (
    <section className="section size-guide-page">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Ring Sizing</span>
          <h2>Find Your Ring Size</h2>
          <p>Two easy ways to measure at home, plus our full size chart for reference.</p>
        </div>

        <div className="size-guide-methods">
          <div className="size-guide-card">
            <Ruler size={22} strokeWidth={1.5} />
            <h3>Method 1: String or Paper Strip</h3>
            <ol>
              <li>Wrap a thin strip of paper or string snugly around the base of your finger.</li>
              <li>Mark the point where the ends overlap with a pen.</li>
              <li>Measure the length in millimeters — this is your circumference.</li>
              <li>Compare it to the "Circumference" column in the chart below.</li>
            </ol>
          </div>

          <div className="size-guide-card">
            <Gem size={22} strokeWidth={1.5} />
            <h3>Method 2: An Existing Ring</h3>
            <ol>
              <li>Pick a ring that already fits the intended finger well.</li>
              <li>Measure the inside diameter in millimeters, edge to edge.</li>
              <li>Compare it to the "Diameter" column in the chart below.</li>
              <li>Measure at the end of the day, when fingers are at their largest.</li>
            </ol>
          </div>
        </div>

        <div className="size-guide-chart-wrap">
          <table className="size-guide-chart">
            <thead>
              <tr>
                <th>US Size</th>
                <th>Diameter (mm)</th>
                <th>Circumference (mm)</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_CHART.map((row) => (
                <tr key={row.us}>
                  <td>{row.us}</td>
                  <td>{row.diameter}</td>
                  <td>{row.circumference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="size-guide-cta">
          <p>Still unsure, or between two sizes? Our atelier offers free, professional ring sizing in person.</p>
          <Link to="/contact" className="btn btn-outline">Visit the Atelier</Link>
        </div>
      </div>
    </section>
  )
}

export default SizeGuide
