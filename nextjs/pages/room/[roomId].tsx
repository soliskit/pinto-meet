import { useRouter } from 'next/router'
import { useRef } from 'react'
import usePeerState from '../../usePeerState'
import useUserMedia from '../../useUserMedia'
import { io } from "socket.io-client"
const socket = io(`https://${process.env.NEXT_PUBLIC_PEER_HOST}`)

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

type StringArray = string[]
const Room = () => {
  const router = useRouter()
  const { roomId } = router.query
  const stream = useUserMedia()
  if (roomId instanceof Array) {
    throw Error("Array passed into room parameter")
  }
  const [userid, calls, peerError] = usePeerState(stream, { userId: undefined, roomId, socket})
  
  let errorMessage = <p></p>

  if (peerError) {
    errorMessage = <div className="error"><h3>Peer</h3><p>{peerError.type}: {peerError.message}</p></div>
  }

  const videos = calls.map((peerCall) => <Video stream={peerCall.stream} />)

  return <div>{errorMessage}<p>Room: {roomId}, User: {userid ?? "Loading..."}</p><Video stream={stream} />{videos}</div>
}

export default Room