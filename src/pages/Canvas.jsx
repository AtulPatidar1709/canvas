'use client'

import { useRef, useState } from 'react'
import { ReactSketchCanvas } from 'react-sketch-canvas'
import Webcam from 'react-webcam'
import { Camera, Eraser, Pen, Redo, RotateCcw, Save, Undo, ImageOff  } from 'lucide-react'

export default function Canvas() {
  const colorInputRef = useRef(null)
  const canvasRef     = useRef(null)
  const webcamRef     = useRef(null)

  const [strokeColor, setStrokeColor] = useState('#a855f7')
  const [eraseMode, setEraseMode]     = useState(false)
  const [showCam, setShowCam]         = useState(false)
  const [bgDataURI, setBgDataURI]     = useState("")

  const openCamera = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true })
      setShowCam(true)
    } catch (err) {
      alert('Camera access denied / not available ', err)
    }
  }

  const resetBg = async () => {
    try {
      setBgDataURI("")
    } catch (err) {
      alert('not available ', err)
    }
  }

  const snap = () => {
    const dataURL = webcamRef.current.getScreenshot()
    setBgDataURI(dataURL)
    setShowCam(false)
  }

  const handleColor  = e => setStrokeColor(e.target.value)
  const handlePen    = () => { setEraseMode(false); canvasRef.current?.eraseMode(false) }
  const handleErase  = () => { setEraseMode(true);  canvasRef.current?.eraseMode(true)  }
  const handleUndo   = () => canvasRef.current?.undo()
  const handleRedo   = () => canvasRef.current?.redo()
  const handleClear  = () => canvasRef.current?.clearCanvas()

  const handleSave   = async () => {
    const dataURL = await canvasRef.current?.exportImage('png')
    if (!dataURL) return
    const link = document.createElement('a')
    link.href = dataURL
    link.download = 'sketch.png'
    link.click()
    alert("Image Saved Successfully")
  }

  return (
    <div className='mt-6 flex max-w-4/5 gap-4 justify-center'>
      {showCam && (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-80 flex flex-col items-center justify-center'>
          <Webcam
            ref={webcamRef}
            className='rounded max-w-full max-h-[60vh]'
            screenshotFormat='image/png'
            muted
          />
          <button
            className='mt-4 px-4 py-2 bg-green-600 text-white rounded'
            onClick={snap}
          >
            Snap & Use
          </button>
        </div>
      )}

      {/* sketch area */}
      <div className='relative w-full rounded-2xl overflow-hidden border border-purple-500 dark:border-purple-800'>
        <ReactSketchCanvas
          width='100%'
          height='100%'
          ref={canvasRef}
          strokeColor={strokeColor}
          backgroundImage={bgDataURI}
          canvasColor='transparent'
          className='!rounded-2xl !border-purple-500 dark:!border-purple-800'
        />
      </div>

      {/* toolbar */}
      <div className='flex flex-col items-center gap-y-6 divide-y divide-purple-200 py-4 dark:divide-purple-900'>
        <button
          size='icon'
          type='button'
          className='p-5 bg-[{strokeColor}]'
          onClick={() => colorInputRef.current?.click()}
          style={{ backgroundColor: strokeColor }}
        >
          <input
            type='color'
            ref={colorInputRef}
            className='sr-only'
            value={strokeColor}
            onChange={handleColor}
          />
        </button>

        <div className='flex flex-col gap-3 pt-6'>
          <button size='icon' disabled={!eraseMode} onClick={handlePen}><Pen size={16}/></button>
          <button size='icon' disabled={eraseMode}  onClick={handleErase}><Eraser size={16}/></button>
        </div>

        <div className='flex flex-col gap-3 pt-6'>
          <button size='icon' onClick={handleUndo}><Undo size={16}/></button>
          <button size='icon' onClick={handleRedo}><Redo size={16}/></button>
          <button size='icon' onClick={handleClear}><RotateCcw size={16}/></button>
          <button size='icon' onClick={handleSave}><Save size={16}/></button>
          <button size='icon' onClick={openCamera}><Camera size={16}/></button>
          <button size='icon' onClick={resetBg}><ImageOff  size={16}/></button>
        </div>
      </div>
    </div>
  )
}