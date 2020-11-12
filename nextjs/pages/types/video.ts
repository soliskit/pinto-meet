import { useRef } from 'react'

const useVideo = (props: { stream: MediaStream }) => {
  const videoRef = useRef<HTMLVideoElement>()

  function handleCanPlay () {
    return videoRef.current.play()
  }

  if (props.stream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = props.stream
  }
  return <video oncanplay={handleCanPlay} autoPlay ref={videoRef} muted></video>
}

export default useVideo
