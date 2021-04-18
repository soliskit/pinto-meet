import { useEffect, useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, prettier/prettier
const Photo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const draw = (context: CanvasRenderingContext2D) => {
    const image: HTMLImageElement = new Image()
    image.src = '/no-video.svg'
    image.onload = () => {
      context.drawImage(image, 0, 0)
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (context) {
      draw(context)
    }
  })
  // w-40 h-40 md:w-56 md:h-56 xl:w-72 xl:h-72

  return (
    <canvas ref={canvasRef} height='300px'/>
  )
}

export default Photo