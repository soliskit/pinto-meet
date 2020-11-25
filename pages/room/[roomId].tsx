import Head from 'next/head'
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

  const toCardinal = (num: number): string => {
    const ones = num % 10
    const tens = num % 100

    if (tens < 11 || tens > 13) {
      switch (ones) {
        case 1:
          return `${num}st`
        case 2:
          return `${num}nd`
        case 3:
          return `${num}rd`
      }
    }

    return `${num}th`
  }

  let errorMessage = <></>
  let roomHeader: JSX.IntrinsicElements['header']
  let connectionButton: JSX.IntrinsicElements['button']
  let muteButton: JSX.IntrinsicElements['button']

  if (peerError) {
    errorMessage = <div className='error'><h3>Peer</h3><p>{peerError.type}: {peerError.message}</p></div>
  }

  if (!userid) {
    roomHeader = <header><h4>Loading...</h4></header>
  } else if (callConnected && calls.length == 0) {
    roomHeader = <header><h4>Joined room: {roomId}</h4><p>You're the only person in the room</p></header>
  } else if (callConnected) {
    roomHeader = <header><h4>Joined room: {roomId} with {toCardinal(calls.length)} participant</h4></header>
  } else {
    roomHeader = <header><h4>Join room: {roomId} to get started</h4></header>
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
  
  return (
    <div>
      <Head>
        <title>Pinto Pinto | {roomId}</title>
        <meta property='og:title' content='Video conferencing for the rest of us'/>
        <meta property='og:description' content='Join the room now to get started' />
        <meta property='og:type' content='website' />
        <meta property='og:image' content='/room_thumbnail.png' />
        <meta property='og:url' content={`https://pintopinto.org${router.asPath}`} />
        <meta name='viewport' content='initial-scale=1.0, user-scalable=no, width=device-width' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {errorMessage}
      {roomHeader}
      <Video stream={stream} muted={true}/>
      {connectionButton}
      {muteButton}
      {videos}
    </div>
  )
}

export default Room
