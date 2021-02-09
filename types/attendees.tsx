import PeerCall from './peer-call'
import Video from './video'

const Attendees = (props: { peerCalls: PeerCall[] }) => {
  // eslint-disable-next-line no-undef
  const videos: JSX.IntrinsicElements['video'][] = props.peerCalls.map((peerCall) => <div className='' key={peerCall.peerId}><Video stream={peerCall.stream} muted={false} key={peerCall.peerId} /></div>)
  return <>{videos}</>
}

export default Attendees