import { useRef } from 'react'
import { Upload, X } from 'lucide-react'

const MAX_DIMENSION = 1200
const JPEG_QUALITY = 0.82

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error)
    reader.onload = () => {
      const img = new Image()
      img.onerror = reject
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
        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

function ImageInput({ value, onChange, label, required, onRemove }) {
  const fileRef = useRef(null)

  const handleFile = async (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    const compressed = await compressImage(file)
    onChange(compressed)
  }

  const isDataUrl = typeof value === 'string' && value.startsWith('data:')

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
          value={isDataUrl ? '' : value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
        <button type="button" className="image-input-upload-btn" onClick={() => fileRef.current?.click()}>
          <Upload size={15} strokeWidth={1.75} />
          Upload
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
      </div>

      {value && (
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
