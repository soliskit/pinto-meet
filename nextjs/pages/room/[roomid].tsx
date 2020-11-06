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
  const [userid, peerError] = usePeerState(stream)
  const _ = useSWR('/api/user/'+ userid + '/room/' + roomid + '/join', fetcher)

  if (peerError) {
    return <p><h3>Peer</h3>{peerError.type}: {peerError.message}</p>
  }

  function handleCanPlay() {
    videoRef.current.play()
  }

  if (stream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = stream
  }

  return <div><p>Room: {roomid}, User: {userid ?? "Loading..."}</p><video onCanPlay={handleCanPlay} autoPlay ref={videoRef} muted></video></div>
}

export default Room