import { useState } from 'react'
import Disconnect from '../public/disconnect'
import Mute from '../public/mute'
import Share from '../public/share'
import UnMute from '../public/unmute'
import styles from '../styles/Presenter.module.css'
import Video from '../types/video'

const Presenter = (props: { stream: MediaStream, disconnect: () => void }) => {
  const [micActivated, setMicActivated] = useState<boolean>(false)

  let muteButton: JSX.IntrinsicElements['button'] // eslint-disable-line no-undef

  const activateMicrophone = () => {
    setMicActivated(true)
    const audioTracks = props.stream.getAudioTracks()
    audioTracks.forEach((track) => {
      track.enabled = true
    })
  }

  const muteMicrophone = () => {
    setMicActivated(false)
    const audioTracks = props.stream.getAudioTracks()
    audioTracks.forEach((track) => {
      track.enabled = false
    })
  }

  if (micActivated) {
    muteButton = <button onClick={muteMicrophone}><Mute/></button>
  } else {
    muteButton = <button onClick={activateMicrophone}><UnMute/></button>
  }

  return (
      <div className={styles.presenterContainer}>
        <span id={styles.presenterWrapper}>
        <Video stream={props.stream} muted={true}/>
          <span id={styles.controlsWrapper}>
            <div className={styles.controlsContainer}>
              {muteButton}
              <button><Share/></button>
              <button onClick={props.disconnect}><Disconnect/></button>
            </div>
          </span>
        </span>
      </div>
  )
}

export default Presenter
