import { useState } from 'react'
import { SketchPicker } from 'react-color'

export function ColorPicker({ onColorChange }) {
  const [color, setColor] = useState('#eeeeee')

  const handleColorChange = (color) => {
    setColor(color.hex)
    onColorChange(color.hex)
  }

  return (
    <div style={{ 
      position: 'absolute', 
      top: '20px', 
      right: '20px', 
      zIndex: 1000,
    }}>
      <div>
        <SketchPicker
          disableAlpha
          color={color}
          onChange={handleColorChange}
        />
      </div>
    </div>
  )
} 