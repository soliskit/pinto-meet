import { useRouter } from 'next/router'
import { useRef, VideoHTMLAttributes } from 'react'
import useSWR from 'swr'
import usePeerState from '../../usePeerState'
import useUserMedia from '../../useUserMedia'

const fetcher = (...args) => fetch(...args).then(res => res)

const Room = () => {
  const router = useRouter()
  const { roomid } = router.query
  const videoRef = useRef<HTMLVideoElement>()
  const stream = useUserMedia()
  const [userid] = usePeerState(stream)
  const _ = useSWR('/api/user/'+ userid + '/room/' + roomid + '/join', fetcher)

  function handleCanPlay() {
    videoRef.current.play()
  }

  if (stream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = stream
  }

  return <div><p>Room: {roomid}, User: {userid}</p><video onCanPlay={handleCanPlay} autoPlay ref={videoRef} muted></video></div>
}

export default Room