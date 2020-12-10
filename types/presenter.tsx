import { NextRouter } from 'next/router'
import { useState } from 'react'
import { Socket } from 'socket.io-client'
import Disconnect from '../public/disconnect'
import Mute from '../public/mute'
import Share from '../public/share'
import UnMute from '../public/unmute'
import styles from '../styles/Presenter.module.css'
import Video from '../types/video'
import PeerCall from './peer-call'

const Presenter = (props: { stream: MediaStream, muted: boolean, router: NextRouter, socket: Socket, roomId: string, userid: string, calls: PeerCall[] }) => {
  const [micActivated, setMicActivated] = useState<boolean>(props.muted)
  const [callStatus, setCallStatus] = useState<boolean>(false)

  let roomHeader = <header><h4>Join room: {props.roomId} to get started</h4></header>
  let joinButton: JSX.IntrinsicElements['button'] // eslint-disable-line no-undef
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

  const join = () => {
    setCallStatus(true)
    if (!props.socket) {
      throw Error('Socket connection failed to initialize')
    }
    props.socket.emit('join-room', props.roomId, props.userid)
  }

  const hangup = () => {
    setCallStatus(false)
    props.socket.disconnect()
    props.router.push('/')
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

  if (callStatus && props.calls.length === 0) {
    roomHeader = <header><h4>Joined room: {props.roomId}</h4><p>You are the only person in the room</p></header>
  } else if (callStatus) {
    roomHeader = <header><h4>Joined room: {props.roomId} with {toCardinal(props.calls.length)} participant</h4></header>
  }

  if (callStatus) {
    joinButton = <></>
  } else {
    joinButton = <div id={styles.connect} className={styles.presenterContainer}><button id={styles.connectControl} onClick={join}>Join Now</button></div>
  }

  if (micActivated) {
    muteButton = <button onClick={muteMicrophone}><Mute/></button>
  } else {
    muteButton = <button onClick={activateMicrophone}><UnMute/></button>
  }

  return (
    <>
      {roomHeader}
      <div className={styles.presenterContainer}>
        <span id={styles.presenterWrapper}>
          <Video stream={props.stream} muted={props.muted}/>
          <span id={styles.controlsWrapper}>
            <div className={styles.controlsContainer}>
              {muteButton}
              <button><Share/></button>
              <button onClick={hangup}><Disconnect/></button>
            </div>
          </span>
        </span>
      </div>
      {joinButton}
    </>
  )
}

export default Presenter
