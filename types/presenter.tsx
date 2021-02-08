import { useState } from 'react'
import Disconnect from '../public/disconnect'
import Mute from '../public/mute'
import Share from '../public/share'
import UnShare from '../public/un-share'
import UnMute from '../public/unmute'
import Video from '../types/video'

const Presenter = (props: { stream: MediaStream, disconnect: () => void }) => {
  const [micActivated, setMicActivated] = useState<boolean>(true)
  const [screenCaptureActivated, setScreenCapture] = useState<boolean>(false)

  let muteButton: JSX.IntrinsicElements['button'] // eslint-disable-line no-undef
  let shareButton: JSX.IntrinsicElements['button'] // eslint-disable-line no-undef

  const activateMicrophone = () => {
    setMicActivated(true)
    const audioTracks = props.stream.getAudioTracks()
    audioTracks.forEach((track) => {
      track.enabled = true
    })
  }

  const deactivateMicrophone = () => {
    setMicActivated(false)
    const audioTracks = props.stream.getAudioTracks()
    audioTracks.forEach((track) => {
      track.enabled = false
    })
  }

  const startScreenCapture = () => { setScreenCapture(true) }

  const endScreenCapture = () => { setScreenCapture(false) }

  if (micActivated) {
    muteButton = <button onClick={deactivateMicrophone}><UnMute/></button>
  } else {
    muteButton = <button onClick={activateMicrophone}><Mute/></button>
  }

  if (screenCaptureActivated) {
    shareButton = <button disabled={true} onClick={endScreenCapture}><UnShare/></button>
  } else {
    shareButton = <button disabled={true} onClick={startScreenCapture}><Share/></button>
  }

  return (
    <div className='w-1/2'>
      <div className='relative'>
        <Video stream={props.stream} muted={true}/>
        <div className='absolute bottom-0 left-0 right-0 px-5'>
          <div className='flex justify-around'>
            {muteButton}
            {shareButton}
            <button onClick={props.disconnect}><Disconnect/></button>
          </div>
          <br/>
        </div>
      </div>
    </div>
  )
}

export default Presenter