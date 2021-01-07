import styles from '../styles/Attendees.module.css'
import PeerCall from './peer-call'
import Video from './video'

const Attendees = (props: { peerCalls: PeerCall[] }) => {
  // eslint-disable-next-line no-undef
  const videos: JSX.IntrinsicElements['video'][] = props.peerCalls.map((peerCall) => <Video stream={peerCall.stream} muted={false} key={peerCall.peerId} />)
  return (
    <span id={styles.presenterWrapper}>
      {videos}
    </span>
  )
}

export default Attendees