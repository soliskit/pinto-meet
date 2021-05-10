import { useEffect, useState } from 'react'

const useUserMedia = (): MediaStream | null => {
  const [stream, setStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    const enableStream = async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        })
        setStream(localStream)
      } catch (error) {
        console.error(error)
      }
    }
    if (!stream) {
      enableStream()
      console.dir(`STREAM ENABLED: ${stream}`)
    } else {
      console.dir(`STREAM EXISTS: ${stream}`)
      return function cleanup() {
        console.dir('STREAM TRACKS STOPPED')
        stream.getTracks().forEach((track) => {
          track.stop()
        })
      }
    }
  }, [stream])
  return stream
}

export default useUserMedia
