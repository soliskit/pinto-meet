import { MediaConnection } from 'peerjs'

export default interface PeerCall {
  peerId: string
  stream: MediaStream
  connection: MediaConnection
}
