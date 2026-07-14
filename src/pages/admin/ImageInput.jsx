import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { supabase } from '../../data/supabaseClient'

const MAX_DIMENSION = 1200
const JPEG_QUALITY = 0.82
const BUCKET = 'product-images'

// Shrink and re-encode before upload so a 6MB phone photo doesn't become a 6MB file.
function compressToBlob(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error)
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('That file is not a readable image.'))
      img.onload = () => {
        let { width, height } = img
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width)
            width = MAX_DIMENSION
          } else {
            width = Math.round((width * MAX_DIMENSION) / height)
            height = MAX_DIMENSION
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error('Could not process that image.'))),
          'image/jpeg',
          JPEG_QUALITY,
        )
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

// Uploads to Storage and returns a URL. The image itself must never be written to
// the database — that is what made the products payload 5MB.
async function uploadToStorage(blob) {
  const path = `uploads/${crypto.randomUUID()}.jpg`
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: 'image/jpeg', cacheControl: '31536000' })
  if (error) throw error
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

function ImageInput({ value, onChange, label, required, onRemove }) {
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const blob = await compressToBlob(file)
      onChange(await uploadToStorage(blob))
    } catch (err) {
      console.error('Image upload failed:', err)
      setError(err.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="image-input">
      {label && (
        <label>
          {label}
          {required && ' *'}
        </label>
      )}

      <div className="image-input-row">
        <input
          type="text"
          placeholder="Paste an image URL..."
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className="image-input-upload-btn"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          <Upload size={15} strokeWidth={1.75} />
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
      </div>

      {error && <span className="form-error">{error}</span>}

      {value && !uploading && (
        <div className="image-input-preview">
          <img src={value} alt="Preview" />
        </div>
      )}

      {onRemove ? (
        <button type="button" className="image-input-remove" onClick={onRemove}>
          <X size={13} strokeWidth={1.75} />
          Remove photo
        </button>
      ) : (
        value && (
          <button type="button" className="image-input-remove" onClick={() => onChange('')}>
            <X size={13} strokeWidth={1.75} />
            Clear image
          </button>
        )
      )}
    </div>
  )
}

export default ImageInput
