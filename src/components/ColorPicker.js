import { useState } from 'react'

export function ColorPicker({ onColorChange }) {
  const [color, setColor] = useState('#eeeeee')

  const handleColorChange = (e) => {
    const newColor = e.target.value
    setColor(newColor)
    onColorChange(newColor)
  }

  return (
    <div style={{ 
      position: 'absolute', 
      top: '20px', 
      right: '20px', 
      zIndex: 1000,
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: '20px',
      borderRadius: '8px',
      color: 'white'
    }}>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Band Color:</label>
        <input
          type="color"
          value={color}
          onChange={handleColorChange}
          style={{ 
            width: '100%',
            height: '30px',
            padding: '0',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        />
      </div>
    </div>
  )
} 