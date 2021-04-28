import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { io, Socket, ManagerOptions, SocketOptions } from 'socket.io-client'
import Attendees from '../../types/attendees'
import Presenter from '../../types/presenter'
import useConnectionState from '../../useConnectionState'
import usePeerState from '../../usePeerState'
import useUserMedia from '../../useUserMedia'
import { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import twilio from 'twilio'


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const Room = ({
  roomName, stunUrl
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const socketRef = useRef<Socket>(undefined)
  const stream = useUserMedia()
  const socketOptions: Partial<ManagerOptions & SocketOptions> = {
    path: `/${process.env.NEXT_PUBLIC_KEY}.io`,
    rememberUpgrade: true
  }

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_NODE_ENV === 'production') {
      socketRef.current = io(
        `https://${process.env.NEXT_PUBLIC_HOST}`,
        socketOptions
      )
    } else {
      socketRef.current = io(
        `http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}`,
        socketOptions
      )
    }
    return function cleanup() {
      socketRef.current.disconnect()
      router.reload() // syncs socket state with peerServer on browser back action
    }
  }, [roomName])

  const [peer, userid, peerError] = usePeerState({ userId: undefined, stunUrl: stunUrl })
  const [calls] = useConnectionState(peer, socketRef.current, stream)
  const [callStatus, setCallStatus] = useState<boolean>(false)
  const attendees = <Attendees peerCalls={calls} />

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
  let roomHeader = (
    <>
      <h1>Join room: {roomName}</h1>
      <h2>to start call</h2>
    </>
  )
  let joinButton = (
    <button
      className='w-1/3 place-self-center py-4 md:py-6 rounded-lg bg-yellow-800'
      onClick={join}
      disabled={!userid}
    >
      Join Now
    </button>
  )

  if (peerError) {
    errorMessage = (
      <div className='error'>
        <h1>Peer</h1>
        <h2>{peerError.type}: {peerError.message}</h2>
      </div>
    )
  }

  if (callStatus) {
    joinButton = <></>
    roomHeader = (
      <>
        <h1>Joined | {roomName}</h1>
        <h2>{toCardinal(calls.length + 1)} in the room</h2>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Pinto Pinto | {roomName}</title>
        <meta
          property='og:title'
          content='Video conferencing for the rest of us'
        />
        <meta
          property='og:description'
          content='Join the room now to get started'
        />
        <meta property='og:type' content='website' />
        <meta property='og:image' content='/room_thumbnail.png' />
        <meta
          property='og:url'
          content={`https://pintopinto.org${router.asPath}`}
        />
        <meta
          name='viewport'
          content='initial-scale=1.0, user-scalable=no, width=device-width'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {errorMessage}
      {roomHeader}
      <div className='p-1 sm:p-3 lg:p-7'>
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4 gap-1 sm:gap-3 lg:gap-7 justify-items-center items-center'>
          {attendees}
        </div>
      </div>
      <div className='mt-5 grid'>{joinButton}</div>
      <Presenter stream={stream} disconnect={hangup} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const client = twilio(process.env.NEXT_PUBLIC_ACCOUNT_SID, process.env.NEXT_PUBLIC_AUTH_TOKEN)
  const iceServers: {url: string, urls: string} = Object((await client.tokens.create()).iceServers.shift())
  const stunUrl = iceServers.url
  let roomName: string
  if (context.query.roomId) {
    roomName = context.query.roomId.toString()
  } else {
    // TODO: - When missing roomId param, use end of url. Unsure when it happens
    roomName = context.resolvedUrl.slice(6)
    console.error('Missing roomId param')
  }

  return {
    props: {
      roomName,
      stunUrl
    }
  }
}

export default Room
