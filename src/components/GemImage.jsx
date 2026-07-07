import './GemImage.css'
import { categoryImages } from '../data/images'

const LABELS = {
  ring: 'Ring',
  necklace: 'Necklace',
  earrings: 'Earrings',
  bracelet: 'Bracelet',
}

function GemImage({ category = 'ring', image, alt, className = '' }) {
  const src = image || categoryImages[category] || categoryImages.ring
  return (
    <div className={`gem-image ${className}`}>
      <img src={src} alt={alt || LABELS[category] || 'Jewelry piece'} loading="lazy" />
    </div>
  )
}

export default GemImage
