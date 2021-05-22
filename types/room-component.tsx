import { useRef, useState } from 'react'
import Attendees from './attendees'
import Presenter from './presenter'
import useConnectionState from '../useConnectionState'
import usePeerState from '../usePeerState'
import useUserMedia from '../useUserMedia'
import PhotoUploader from './photo-uploader'
import useSocketState from '../useSocketState'

const RoomComponent = (
  props: {
    roomName: string, 
    stunUrl: string
  } 
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const cameraStream = useUserMedia()
  const socket = useSocketState()
  const [peer, userid, peerError] = usePeerState({ userId: undefined, stunUrl: props.stunUrl })
  const [calls] = useConnectionState(peer, socket, stream)
  const [callStatus, setCallStatus] = useState<boolean>(false)
  const attendees = <Attendees peerCalls={calls} />

  const join = () => {
    setCallStatus(true)
    socket?.emit('join-room', props.roomName, userid)
  }

  const toggleVideo = () => {
    setStream((localStream) => {
      cameraStream?.getTracks().forEach((newTrack) => {
        trackDidChange(newTrack)
      })
      return localStream
    })
  }

  const hangup = () => {
    setCallStatus(false)
    socket?.disconnect()
    socket?.connect()
  }

  let errorMessage = <></>
  
  const trackDidChange = (newTrack: MediaStreamTrack) => {
    setStream((localStream) => {
        if (localStream) {
          const oldTrack = localStream.getTracks().find((track) => {
            return track.kind === newTrack.kind
          })
          if (oldTrack) {
            localStream.removeTrack(oldTrack)
          }
          localStream.addTrack(newTrack)
        } else {
          localStream = new MediaStream([newTrack])
        }
        calls.forEach((peerCall) => {
          const sender = peerCall.connection.peerConnection.getSenders().find((sender) => {
            return sender.track?.kind === newTrack.kind
          })
          sender?.replaceTrack(newTrack)
        })
      return localStream
    })
  }

  let roomHeader = (
    <>
      <h1>Join room: {props.roomName}</h1>
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
  const cameraButton = (
    <button
    className='w-1/3 place-self-center py-4 md:py-6 rounded-lg bg-yellow-800'
    onClick={toggleVideo}
  >
    Camera Button
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
        <h1>Joined | {props.roomName}</h1>
        <h2>{toCardinal(calls.length + 1)} in the room</h2>
      </>
    )
  }

  return (
    <>
      {errorMessage}
      {roomHeader}
      <div className='p-1 sm:p-3 lg:p-7'>
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4 gap-1 sm:gap-3 lg:gap-7 justify-items-center items-center'>
          {attendees}
        </div>
      </div>
      <div className='mt-5 grid'>{joinButton}</div>
      <div className='mt-5 grid'>{cameraButton}</div>
      <canvas style={{display: "none"}} width="400px" height="300px" ref={canvasRef}></canvas>
      <PhotoUploader stream={stream} trackDidChange={trackDidChange} peer={peer} canvasRef={canvasRef}/>
      <Presenter stream={stream} disconnect={hangup} />
    </>
  )
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

export default RoomComponent

