import { useState, useEffect } from 'react'

const useUserMedia = (): MediaStream => {
  const [stream, setStream] = useState(null)

  useEffect(() => {
    async function enableStream () {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        setStream(localStream)
      } catch (error) {
        console.error(error)
      }
    }
    if (!stream) {
      enableStream()
    } else {
      return function cleanup () {
        stream.getTracks().forEach(track => {
          track.stop()
        })
      }
    }
  }, [stream])
  return stream
}

export default useUserMedia
