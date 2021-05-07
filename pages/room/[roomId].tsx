import { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useRef } from 'react'
import twilio from 'twilio'
import RoomComponent from '../../types/room-component'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const Room = ({
  roomName, stunUrl
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
      <canvas style={{display: "none"}} width="400px" height="300px" ref={canvasRef}></canvas>
      <RoomComponent roomName={roomName} stunUrl={stunUrl} canvasRef={canvasRef} />
    </>
  )
}

export default Room

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