import { useState, useRef } from 'react'

export function ImageUploader({ onFrontImageChange, onBackImageChange }) {
  const [frontImage, setFrontImage] = useState(null)
  const [backImage, setBackImage] = useState(null)
  const frontInputRef = useRef(null)
  const backInputRef = useRef(null)

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
    <div className="absolute top-[20px] left-[20px] z-[1000] bg-black/70 p-[14px] rounded-[8px] text-white">
      <div className="mb-[10px]">
        <input
          ref={frontInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, 'front')}
          className="text-white hidden"
        />
        <button 
          onClick={() => frontInputRef.current.click()}
          className="px-2 py-1 bg-[#eeeeee] border-none rounded text-black cursor-pointer text-[16px]"
          style={{ letterSpacing: '-0.6px' }}
        >
          Front Image
        </button>
      </div>
      <div>
        <input
          ref={backInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, 'back')}
          className="text-white hidden"
        />
        <button 
          onClick={() => backInputRef.current.click()}
          className="px-2 py-1 bg-[#eeeeee] border-none rounded text-black cursor-pointer text-[16px]"
          style={{ letterSpacing: '-0.6px' }}
        >
          Back Image
        </button>
      </div>
    </div>
  )
} 