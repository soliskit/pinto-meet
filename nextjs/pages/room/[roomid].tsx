import { useRouter } from 'next/router'
import { useRef } from 'react'
import useSWR from 'swr'
import usePeerState from '../../usePeerState'
import useUserMedia from '../../useUserMedia'

const fetcher = (...args) => fetch(...args).then(res => res)

const Video = (props: { stream: MediaStream }) => {
  const videoRef = useRef<HTMLVideoElement>()

  function handleCanPlay() {
    return videoRef.current.play()
  }

  if (props.stream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = props.stream
  }

  return <video onCanPlay={handleCanPlay} autoPlay ref={videoRef} muted></video>
}

const Room = () => {
  const router = useRouter()
  const { roomid } = router.query
  const videoRef = useRef<HTMLVideoElement>()
  const stream = useUserMedia()
  const [userid, calls, peerError] = usePeerState(stream)
  const _ = useSWR('/api/user/'+ userid + '/room/' + roomid + '/join', fetcher)
  let errorMessage = <p></p>

  if (peerError) {
    errorMessage = <p><h3>Peer</h3>{peerError.type}: {peerError.message}</p>
  }

  const videos = calls.map((peerCall) => <Video stream={peerCall.stream} />)

  return <div>{errorMessage}<p>Room: {roomid}, User: {userid ?? "Loading..."}</p><Video stream={stream} />{videos}</div>
}

export default Room