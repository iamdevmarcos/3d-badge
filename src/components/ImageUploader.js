import { useState } from 'react'

export function ImageUploader({ onFrontImageChange, onBackImageChange }) {
  const [frontImage, setFrontImage] = useState(null)
  const [backImage, setBackImage] = useState(null)

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target.result
        if (type === 'front') {
          setFrontImage(imageUrl)
          onFrontImageChange(imageUrl)
        } else {
          setBackImage(imageUrl)
          onBackImageChange(imageUrl)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div style={{ 
      position: 'absolute', 
      top: '20px', 
      left: '20px', 
      zIndex: 1000,
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: '20px',
      borderRadius: '8px',
      color: 'white'
    }}>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Front Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, 'front')}
          style={{ color: 'white' }}
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '5px' }}>Back Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, 'back')}
          style={{ color: 'white' }}
        />
      </div>
    </div>
  )
} 