import { useRef } from 'react'
import { Upload, X } from 'lucide-react'

function ImageInput({ value, onChange, label, required, onRemove }) {
  const fileRef = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result)
    reader.readAsDataURL(file)
    e.target.value = ''
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
