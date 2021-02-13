import { useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, prettier/prettier
const Video = (props: { stream: MediaStream, muted: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleCanPlay = () => {
    if (!videoRef.current) {
      throw Error('Video Element missing source')
    }
    return videoRef.current.play()
  }

  if (props.stream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.muted = props.muted
    videoRef.current.srcObject = props.stream
  }

  return (
    <video
      className='rounded-lg'
      ref={videoRef}
      onCanPlay={handleCanPlay}
      playsInline
      autoPlay>
    </video>
  )
}

export default Video
