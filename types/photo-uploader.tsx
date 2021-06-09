import { RefObject, useEffect, useState } from 'react'
import Peer from 'peerjs'

const PhotoUploader = (
  props: {
    stream: MediaStream | null,
    trackDidChange: (newTrack: MediaStreamTrack, usingCamera: boolean) => void,
    canvasRef: RefObject<HTMLCanvasElement>,
    peer: Peer | null,
    cameraEnabled: boolean
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
      if (props.peer) {
        const [x, y, width, height] = positionDimension(image, context)
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        context.drawImage(image, x, y, width, height)
        canvas.captureStream().getTracks().forEach((newTrack) => {
          props.trackDidChange(newTrack, false)
        })
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

  let disableCameraButton = (
    <button className='bg-black my-1.5' onClick={draw}>Stop Video</button>
  )
  if(!props.cameraEnabled) {
    disableCameraButton = <></>
  }

  useEffect(() => {
    draw()
    return function cleanup() {
      console.dir("cleanup <PhotoUploader>'s useEffect")
    }
  }, [photo, props.peer])

  return (
    <>
      {disableCameraButton}
      <form encType='multipart/form-data'>
        <input
          type='file'
          disabled={props.cameraEnabled}
          accept='image/*'
          id="profile_photo"
          onChange={handleChange}
        />
      </form>
      <button
        onClick={removePhoto}
        style={{display: photo === defaultPhoto || props.cameraEnabled ? "none" : "block", position: "absolute", minWidth: "44px", height: "44px", padding: "0", marginLeft: "200px", marginTop: "-150px", textAlign: "center", backgroundColor: "#444444AA", borderRadius: "22px", zIndex: 2}}
      >
        remove
      </button>
    </>
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