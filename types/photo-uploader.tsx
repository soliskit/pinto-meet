import { RefObject, useEffect, useRef, useState } from 'react'
import Peer from 'peerjs'

const PhotoUploader = (
  props: {
    stream: MediaStream | null,
    streamDidChange: (stream: MediaStream) => void,
    canvasRef: RefObject<HTMLCanvasElement>,
    peer: Peer | null
  }) => {
  const defaultPhoto = '/no-video.svg'
  const [photo, setPhoto] = useState(defaultPhoto)
  const imageRef = useRef<HTMLImageElement>(new Image())

  const draw = (context: CanvasRenderingContext2D) => {
    let imageWidth: number
    let imageHeight: number
    const image = imageRef.current
    image.src = photo
    image.decode().then(() => {
      console.dir('IMAGE DECODED')
      console.dir(`PEER: ${props.peer}`)
      console.dir(`STREAM: ${props.stream}`)
    //   const ratio = Math.min(288 / image.width, 288 / image.height)
    //   if (image.width > 288 || image.height > 288) {
    //     imageWidth = image.width * ratio
    //     imageHeight = image.height * ratio
    //   } else {
    //     imageWidth = image.width
    //     imageHeight = image.height
    //   }
    //   const x = context.canvas.width / 2 - imageWidth / 2
    //   const y = context.canvas.height / 2 - imageHeight / 2
    //   context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    //   context.drawImage(image, x, y, imageWidth, imageHeight)
    // })
    // console.dir('decode')
    // const ratio = Math.min(288 / image.width, 288 / image.height)
    // if (image.width > 288 || image.height > 288) {
    //   imageWidth = image.width * ratio
    //   imageHeight = image.height * ratio
    // } else {
    //   imageWidth = image.width
    //   imageHeight = image.height
    // }
    // const x = context.canvas.width / 2 - imageWidth / 2
    // const y = context.canvas.height / 2 - imageHeight / 2
    // context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    // context.drawImage(image, x, y, imageWidth, imageHeight)
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

  const redraw = () => {
    if (!props.canvasRef.current) {
      throw Error('Missing canvas element reference')
    }
    const canvas = props.canvasRef.current
    const context = canvas.getContext('2d')
    let imageWidth: number
    let imageHeight: number
    const image = imageRef.current
    if (context) {
      console.dir('redrawing')
      console.dir(props.peer)
      console.dir(props.stream)
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

  useEffect(() => {
    if (!props.canvasRef.current) {
      throw Error('Missing canvas element reference')
    }
    const canvas = props.canvasRef.current
    const context = canvas.getContext('2d')
    if (props.peer) {
      props.streamDidChange(canvas.captureStream())
    }
    if (context) {
      draw(context)
    }
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
      <button onClick={redraw}>ReDraw</button>
    </div>
  )
}

export default PhotoUploader