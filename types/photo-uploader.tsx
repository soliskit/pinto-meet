import { useEffect, useRef, useState } from 'react'
import Video from '../types/video'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, prettier/prettier
const PhotoUploader = () => {
  const defaultPhoto = '/no-video.svg'
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [photo, setPhoto] = useState(defaultPhoto)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const draw = (context: CanvasRenderingContext2D) => {
    const image: HTMLImageElement = new Image()
    let canvasWidth: number
    let canvasHeight: number
    image.src = photo
    image.onload = () => {
      const ratio = Math.min(288 / image.width, 288 / image.height)
      if (image.width > 288 || image.height > 288) {
        canvasWidth = image.width * ratio
        canvasHeight = image.height * ratio
      } else {
        canvasWidth = image.width
        canvasHeight = image.height
      }
      context.clearRect(0, 0, context.canvas.width, context.canvas.height)
      context.drawImage(image, 0, 0, canvasWidth, canvasHeight)
    }
  }

  const handleChange = (event: any) => {
    if (event.target.files[0]) {
      setPhoto(URL.createObjectURL(event.target.files[0]))
    }
  }

  const removePhoto = () => {
    setPhoto(defaultPhoto)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (context && canvas) {
      draw(context)
      setStream(canvas.captureStream())
    }
  }, [photo])

  return (
    <div className='flex flex-col items-center'>
      <form encType='multipart/form-data'>
        <input
          type='file'
          accept='image/*'
          id="profile_photo"
          onChange={handleChange}
        />
        <button onClick={removePhoto}>Remove photo</button>
        <canvas ref={canvasRef} height='288px'/>
        {/* @ts-ignore */}
        <Video stream={stream} muted={true} /> 
      </form>
    </div>
  )
}

export default PhotoUploader