import { RefObject, useEffect, useRef, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, prettier/prettier
const PhotoUploader = (props: { stream: MediaStream | null, streamDidChange: (stream: MediaStream) => void, canvasRef: RefObject<HTMLCanvasElement>}) => {
  const defaultPhoto = '/no-video.svg'
  const [photo, setPhoto] = useState(defaultPhoto)

  const draw = (context: CanvasRenderingContext2D) => {
    const image: HTMLImageElement = new Image()
    let imageWidth: number
    let imageHeight: number
    image.src = photo
    image.onload = () => {
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
      context.clearRect(0, 0, context.canvas.width, context.canvas.height)
      context.drawImage(image, x, y, imageWidth, imageHeight)
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
    if (!props.canvasRef.current) {
      throw Error('Missing canvas element reference')
    }
    const canvas = props.canvasRef.current
    const context = canvas.getContext('2d')
    if(!props.stream) {
      props.streamDidChange(canvas.captureStream())
    }
    if (context) {
      draw(context)
    }
  }, [photo, props.stream])

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
      </form>
    </div>
  )
}

export default PhotoUploader