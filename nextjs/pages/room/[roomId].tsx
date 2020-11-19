import { useRouter } from 'next/router'
import usePeerState from '../../usePeerState'
import useUserMedia from '../../useUserMedia'
import { io, Socket } from 'socket.io-client'
import useConnectionState from '../../useConnectionState'
import Video from '../../types/video'
import { useEffect, useRef } from 'react'

const Room = () => {
  const socketRef = useRef<Socket>(undefined) 
  const router = useRouter()
  const { roomId } = router.query
  const stream = useUserMedia()
  if (roomId instanceof Array) {
    throw Error('Array passed into room parameter')
  }

  useEffect( () => {
    socketRef.current = io(`https://${process.env.NEXT_PUBLIC_PEER_HOST}`)
  }, [process.env.NEXT_PUBLIC_PEER_HOST])
  
  const [userid, peer, peerError] = usePeerState({ userId: undefined, roomId, socket: socketRef.current })
  const [calls] = useConnectionState(peer, socketRef.current, stream)
  let errorMessage = <p></p>

  if (peerError) {
    errorMessage = <div className="error"><h3>Peer</h3><p>{peerError.type}: {peerError.message}</p></div>
  }

  const videos = calls.map((peerCall) => <Video stream={peerCall.stream} key={peerCall.peerId} />)

  return <div>{errorMessage}<p>Room: {roomId}, User: {userid ?? 'Loading...'}</p><Video stream={stream} />{videos}</div>
}

export default Room
