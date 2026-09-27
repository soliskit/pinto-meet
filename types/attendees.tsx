import { JSX } from 'react'
import PeerCall from './peer-call'
import Video from './video'

const Attendees = (props: { peerCalls: PeerCall[] }) => {
  const videos: JSX.Element[] = props.peerCalls.map((peerCall) => (
    <Video stream={peerCall.stream} muted={false} key={peerCall.peerId} />
  ))
  return <>{videos}</>
}

export default Attendees
