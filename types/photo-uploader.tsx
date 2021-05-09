import { RefObject, useEffect, useState } from 'react'
import Peer from 'peerjs'

const PhotoUploader = (
  props: {
    stream: MediaStream | null,
    streamDidChange: (stream: MediaStream) => void,
    canvasRef: RefObject<HTMLCanvasElement>,
    peer: Peer | null
  }) => {
  const defaultPhoto = '/no-video.svg'
  const [photo, setPhoto] = useState<string>(defaultPhoto)

  const draw = () => {
    const canvas = props.canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) {
      console.dir('Canvas or Contex NULL')
      return
    }
    const image = new Image()
    image.src = photo
    image.decode().then(() => {
      console.dir('IMAGE DECODED')
      console.dir(`STREAM: ${props.stream}`)
      if (props.peer) {
        const [x, y, width, height] = positionDimension(image, context)
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        context.drawImage(image, x, y, width, height)
        console.dir('CAPTURING STREAM')
        props.streamDidChange(canvas.captureStream())
      } else {
        console.dir('SKIP CAPTURING STREAM')
      }
    })
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
    draw()
    return function cleanup() {
      console.dir("cleanup <PhotoUploader>'s useEffect")
    }
  }, [photo, props.peer])

  return (
    <div className='flex flex-col items-center'>
      <form encType='multipart/form-data'>
        <input
          type='file'
          accept='image/*'
          id="profile_photo"
          onChange={handleChange}
        />
      </form>
      <button onClick={removePhoto}>Remove photo</button>
      <button onClick={draw}>ReDraw</button>
    </div>
  )
}

const positionDimension = (image: HTMLImageElement, context: CanvasRenderingContext2D): [
  x: number,
  y: number, 
  width: number, 
  height: number
] => {
  let imageWidth: number
  let imageHeight: number
  const ratio = Math.min(288 / image.width, 288 / image.height)
  if (image.width > 288 || image.height > 288) {
    imageWidth = image.width * ratio
    imageHeight = image.height * ratio
  } else {
    imageWidth = image.width
    imageHeight = image.height
  }
  const x = context.canvas.width / 2 - imageWidth / 2
  const y = context.canvas.height / 2 - imageHeight / 2

  return [x, y, imageWidth, imageHeight]
}

export default PhotoUploader