import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { io, Socket, ManagerOptions, SocketOptions } from 'socket.io-client'
import styles from '../../styles/Room.module.css'
import Attendees from '../../types/attendees'
import Presenter from '../../types/presenter'
import useConnectionState from '../../useConnectionState'
import usePeerState from '../../usePeerState'
import useUserMedia from '../../useUserMedia'
import { InferGetServerSidePropsType, GetServerSideProps } from 'next'

const Room = ({ roomName }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  // @ts-ignore
  const socketRef = useRef<Socket>(undefined)
  const stream = useUserMedia()
  const socketOptions: Partial<ManagerOptions & SocketOptions> = {
    path: `/${process.env.NEXT_PUBLIC_KEY}.io`
  }

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_NODE_ENV === 'production') {
      socketRef.current = io(`https://${process.env.NEXT_PUBLIC_HOST}`, socketOptions)
    } else {
      socketRef.current = io(`http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}`, socketOptions)
    }
    return function cleanup () {
      socketRef.current.disconnect()
      router.reload() // syncs socket state with peerServer on browser back action
    }
  }, [roomName])

  const [userid, peer, peerError] = usePeerState({ userId: undefined })
  const [calls] = useConnectionState(peer, socketRef.current, stream)
  const [callStatus, setCallStatus] = useState<boolean>(false)
  const attendees = <Attendees peerCalls={calls}/>

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
    socketRef.current.emit('join-room', roomName, userid)
  }

  const hangup = () => {
    setCallStatus(false)
    router.push('/')
  }

  let errorMessage = <></>
  let roomHeader = <header><h4>Join room: {roomName} to get started</h4></header>
  let joinButton = <div id={styles.connect} className={styles.connectContainer}><button id={styles.connectControl} onClick={join}>Join Now</button></div>

  if (peerError) {
    errorMessage = <div className='error'><h3>Peer</h3><p>{peerError.type}: {peerError.message}</p></div>
  }

  if (callStatus && calls.length === 0) {
    roomHeader = <header><h4>Joined room: {roomName}</h4><p>You are the only person in the room</p></header>
  } else if (callStatus) {
    roomHeader = <header><h4>Joined room: {roomName} with {toCardinal(calls.length)} participant</h4></header>
  }

  if (callStatus) {
    joinButton = <></>
  }

  return (
    <div>
      <Head>
        <title>Pinto Pinto | {roomName}</title>
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
      {attendees}
      <Presenter stream={stream} disconnect={hangup}/>
      {joinButton}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let roomName: String
  if (context.query.roomId) {
    roomName = context.query.roomId.toString()
  } else { // if roomId param is missing, use end of url
    roomName = context.resolvedUrl.slice(6)
  }

  return {
    props: {
      roomName
    }
  }
}

export default Room