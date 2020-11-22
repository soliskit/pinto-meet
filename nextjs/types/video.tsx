import { useRef } from 'react'

const Video = (props: { stream: MediaStream }) => {
  const videoRef = useRef<HTMLVideoElement>()

  function handleCanPlay () {
    return videoRef.current.play()
  }

  if (props.stream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.muted = true // this line is going away
    videoRef.current.srcObject = props.stream
  }

  return <video onCanPlay={handleCanPlay} autoPlay ref={videoRef}></video>
}

export default Video
