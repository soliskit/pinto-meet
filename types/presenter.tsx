import { useState } from 'react'
import Disconnect from '../public/disconnect'
import Mute from '../public/mute'
import Share from '../public/share'
import UnShare from '../public/un-share'
import UnMute from '../public/unmute'
import Video from '../types/video'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const Presenter = (props: { stream: MediaStream; disconnect: () => void }) => {
  const [micActivated, setMicActivated] = useState<boolean>(true)
  const [videoActive, setVideoActive] = useState<boolean>(true)
  const [screenCaptureActivated, setScreenCapture] = useState<boolean>(false)

  // eslint-disable-next-line no-undef
  let muteButton: JSX.IntrinsicElements['button']
  // eslint-disable-next-line no-undef
  let videoButton: JSX.IntrinsicElements['button']
  // eslint-disable-next-line no-undef
  let shareButton: JSX.IntrinsicElements['button']

  const activateMicrophone = () => {
    setMicActivated(true)
    const audioTracks = props.stream.getAudioTracks()
    audioTracks.forEach((track) => {
      props.stream.addTrack(track)
    })
  }

  const deactivateMicrophone = () => {
    setMicActivated(false)
    const audioTracks = props.stream.getAudioTracks()
    audioTracks.forEach((track) => {
      props.stream.removeTrack(track)
    })
  }

  const startVideo = () => {
    setVideoActive(true)
  }

  const stopVideo = () => {
    setVideoActive(false)
  }

  const startScreenCapture = () => {
    setScreenCapture(true)
  }

  const endScreenCapture = () => {
    setScreenCapture(false)
  }

  if (micActivated) {
    muteButton = <button className='bg-yellow-600' onClick={deactivateMicrophone}>Mute</button>
  } else {
    muteButton = <button className='bg-yellow-600' onClick={activateMicrophone}>Unmute</button>
  }

  if (screenCaptureActivated) {
    shareButton = (
      <button disabled={true} onClick={endScreenCapture}>
        <UnShare />
      </button>
    )
  } else {
    shareButton = (
      <button disabled={true} onClick={startScreenCapture}>
        <Share />
      </button>
    )
  }

  if (videoActive) {
    videoButton = <button className='bg-black my-1.5' onClick={stopVideo}>Stop Video</button>
  } else {
    videoButton = <button className='bg-black my-1.5' onClick={startVideo}>Start Video</button>
  }

  return (
    <div className='presenter filter safe-inset-bottom'>
      <div className='flex justify-center'>
        <div className='flex flex-col justify-center pr-1.5'>
          {muteButton}
          {videoButton}
          <button className='bg-red-800' onClick={props.disconnect}>End</button>
        </div>
        <Video stream={props.stream} muted={true} />
      </div>
    </div>
  )
}

export default Presenter
