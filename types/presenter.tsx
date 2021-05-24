import Peer from 'peerjs'
import { RefObject, useState } from 'react'
import Video from '../types/video'
import PhotoUploader from './photo-uploader'

const Presenter = (
  props: {
    peer: Peer | null,
    stream: MediaStream | null,
    canvasRef: RefObject<HTMLCanvasElement>,
    startCall: () => void,
    disconnect: () => void,
    videoEnabled: boolean,
    startVideo: () => void
    trackDidChange: (newTrack: MediaStreamTrack, usingCamera: boolean) => void
  }) => {
  const [micActivated, setMicActivated] = useState<boolean>(true)
  const [audioTrack, setAudioTrack] = useState<MediaStreamTrack | undefined>(undefined)

  // eslint-disable-next-line no-undef
  let muteButton: JSX.IntrinsicElements['button']
  // eslint-disable-next-line no-undef
  let videoButton: JSX.IntrinsicElements['button']
  // eslint-disable-next-line no-undef
  let callButton: JSX.IntrinsicElements['button']

  const activateMicrophone = () => {
    setMicActivated(true)
    if (audioTrack) {
      props.stream?.addTrack(audioTrack)
    }
  }

  const deactivateMicrophone = () => {
    if (!props.stream) {
      return
    }
    setMicActivated(false)
    if (!audioTrack) {
      const track = props.stream.getAudioTracks()[0]
      setAudioTrack(track)
      props.stream.removeTrack(track)
    } else {
      props.stream.removeTrack(audioTrack)
    }
  }

  if (micActivated) {
    muteButton = <button className='bg-yellow-600' onClick={deactivateMicrophone}>Mute</button>
  } else {
    muteButton = <button className='bg-yellow-600' onClick={activateMicrophone}>Unmute</button>
  }

  if (props.videoEnabled) {
    callButton = <button className='bg-yellow-800' onClick={props.startCall}>Join Now</button>
  } else {
    callButton = <button className='bg-red-800' onClick={props.disconnect}>End</button>
  }

  if (props.videoEnabled) {
    videoButton = <></>
  } else {
    videoButton = <button className='bg-black my-1.5' onClick={props.startVideo}>Start Video</button>
  }

  return (
    <div className='presenter filter safe-inset-bottom'>
      <div className='flex justify-center'>
        <div className='flex flex-col justify-center pr-1.5'>
          {muteButton}
          {videoButton}
          <PhotoUploader stream={props.stream} trackDidChange={props.trackDidChange} peer={props.peer} canvasRef={props.canvasRef} cameraEnabled={props.videoEnabled} />
          {callButton}
        </div>
        <label htmlFor="profile_photo">
          <Video stream={props.stream} muted={true} /> 
        </label>
      </div>
    </div>
  )
}

export default Presenter
