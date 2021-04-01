import PeerCall from './peer-call'
import Video from './video'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const Attendees = (props: { peerCalls: PeerCall[] }) => {
  // eslint-disable-next-line no-undef
  const videos: JSX.IntrinsicElements['video'][] = props.peerCalls.map(
    (peerCall) => (
      <>
        <Video stream={peerCall.stream} muted={false} key={peerCall.peerId} />
      </>
    )
  )
  return <>{videos}</>
}

export default Attendees
