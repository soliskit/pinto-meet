import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import styles from '../../styles/Room.module.css'
import Presenter from '../../types/presenter'
import Video from '../../types/video'
import useConnectionState from '../../useConnectionState'
import usePeerState from '../../usePeerState'
import useUserMedia from '../../useUserMedia'

const Room = () => {
  // @ts-ignore
  const socketRef = useRef<Socket>(undefined)
  const router = useRouter()
  const { roomId } = router.query
  const stream = useUserMedia()
  if (roomId instanceof Array) {
    throw Error('Array passed into room parameter')
  }

  useEffect(() => {
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
  const [callStatus, setCallStatus] = useState<boolean>(false)

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

  const join = () => {
    setCallStatus(true)
    if (!socketRef.current) {
      throw Error('Socket connection failed to initialize')
    }
    socketRef.current.emit('join-room', roomId, userid)
  }

  const hangup = () => {
    setCallStatus(false)
    socketRef.current.disconnect()
    router.push('/')
  }

  let errorMessage = <></>
  let roomHeader = <header><h4>Join room: {roomId} to get started</h4></header>
  let joinButton = <div id={styles.connect} className={styles.connectContainer}><button id={styles.connectControl} onClick={join}>Join Now</button></div>

  if (peerError) {
    errorMessage = <div className='error'><h3>Peer</h3><p>{peerError.type}: {peerError.message}</p></div>
  }

  if (callStatus && calls.length === 0) {
    roomHeader = <header><h4>Joined room: {roomId}</h4><p>You are the only person in the room</p></header>
  } else if (callStatus) {
    roomHeader = <header><h4>Joined room: {roomId} with {toCardinal(calls.length)} participant</h4></header>
  }

  if (callStatus) {
    joinButton = <></>
  }

  // eslint-disable-next-line no-undef
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
      <Presenter stream={stream} disconnect={hangup}/>
      {joinButton}
      {videos}
    </div>
  )
}

export default Room
