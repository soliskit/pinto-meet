import { useRef } from 'react'

const Video = (props: { stream: MediaStream, muted: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>()

  function handleCanPlay () {
    return videoRef.current.play()
  }

  if (props.stream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.muted = props.muted
    videoRef.current.srcObject = props.stream
  }

  return <video onCanPlay={handleCanPlay} autoPlay ref={videoRef} playsInline></video>
}

export default Video
