import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
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

  let errorMessage = <></>

  if (peerError) {
    errorMessage = <div className='error'><h3>Peer</h3><p>{peerError.type}: {peerError.message}</p></div>
  }

  if (roomId === undefined || userid === undefined) {
    return <></>
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
      <Presenter stream={stream} muted={true} router={router} socket={socketRef.current} roomId={roomId} userid={userid} calls={calls}/>
      {videos}
    </div>
  )
}

export default Room
