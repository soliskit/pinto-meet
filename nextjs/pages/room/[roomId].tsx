import { useRouter } from 'next/router'
import usePeerState from '../../usePeerState'
import useUserMedia from '../../useUserMedia'
import { io, Socket } from 'socket.io-client'
import useConnectionState from '../../useConnectionState'
import Video from '../../types/video'
import { useEffect, useRef, useState } from 'react'

const Room = () => {
  const socketRef = useRef<Socket>(undefined) 
  const router = useRouter()
  const { roomId } = router.query
  const stream = useUserMedia()
  if (roomId instanceof Array) {
    throw Error('Array passed into room parameter')
  }

  useEffect( () => {
    if (process.env.NEXT_PUBLIC_IS_SECURE === 'true') {
      socketRef.current = io(`https://${process.env.NEXT_PUBLIC_HOST}`)
    } else {
      if (!process.env.NEXT_PUBLIC_PORT) {
        throw Error('Missing port for insecure connection')
      }
      socketRef.current = io(`http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}`)
    }
  }, [process.env.NEXT_PUBLIC_PEER_HOST])
  
  const [userid, peer, peerError] = usePeerState({ userId: undefined })
  const [calls] = useConnectionState(peer, socketRef.current, stream)
  const [callConnected, setCallConnected] = useState<boolean>(false)
  const [micActivated, setMicActivated] = useState<boolean>(true)

  const hangup = () => {
    setCallConnected(false)
    socketRef.current.disconnect()
    router.push('/')
  }
  const join = () => {
    if (!socketRef.current) {
      throw Error('Socket connection failed to initialize')
    }
    setCallConnected(true)
    socketRef.current.emit('join-room', roomId, userid)
  }

  const muteMicrophone = () => {
    setMicActivated(false)
    const audioTracks = stream.getAudioTracks()
    audioTracks.forEach((track) => {
      track.enabled = false
    })
  }

  const activateMicrophone = () => {
    setMicActivated(true)
    const audioTracks = stream.getAudioTracks()
    audioTracks.forEach((track) => {
      track.enabled = true
    })
  }

  let errorMessage = <p></p>
  let connectionButton: JSX.IntrinsicElements['button']
  let muteButton: JSX.IntrinsicElements['button']

  if (peerError) {
    errorMessage = <div className='error'><h3>Peer</h3><p>{peerError.type}: {peerError.message}</p></div>
  }

  if (callConnected) {
    connectionButton = <button onClick={hangup}>Hangup</button>
  } else {
    connectionButton = <button onClick={join}>Join Now</button>
  }

  if (micActivated) {
    muteButton = <button onClick={muteMicrophone}>Mute</button>
  } else {
    muteButton = <button onClick={activateMicrophone}>Unmute</button>
  }

  const videos: JSX.IntrinsicElements['video'][] = calls.map((peerCall) => <Video stream={peerCall.stream} muted={false} key={peerCall.peerId} />)
  
return <div>{errorMessage}<p>Room: {roomId}, User: {userid ?? 'Loading...'}</p><Video stream={stream} muted={true}/>{connectionButton}{muteButton}{videos}</div>
}

export default Room
