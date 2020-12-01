import { useRef } from 'react'
import styles from '../styles/Video.module.css'

const Video = (props: { stream: MediaStream, muted: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>()

  function handleCanPlay () {
    return videoRef.current.play()
  }

  if (props.stream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.muted = props.muted
    videoRef.current.srcObject = props.stream
  }

  return (
    <video 
      className={styles.video} 
      ref={videoRef} 
      onCanPlay={handleCanPlay} 
      playsInline 
      autoPlay>
    </video>
  )
}

export default Video
