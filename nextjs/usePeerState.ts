import { useEffect, useState } from 'react'
import Peer, { MediaConnection } from 'peerjs'
import { Socket } from 'socket.io-client'

// copied partially from https://github.com/madou/react-peer/blob/master/src/use-peer-state.tsx
const usePeerState = (
  stream: MediaStream,
  opts: { userId: string | undefined, roomId: string, socket: Socket } = { userId: undefined, roomId: undefined, socket: undefined }
): [string | undefined, Peer, PeerError | undefined] => {
  const [error, setError] = useState<PeerError | undefined>(undefined)
  const [peer, setPeer] = useState<Peer | undefined>(undefined)
  const [userId, setUserId] = useState(opts.userId)
  const socket = opts.socket
  const roomId = opts.roomId

  useEffect(
    () => {
      import('peerjs').then(({ default: Peer }) => {
        const localPeer = new Peer(opts.userId, { 
          host: process.env.NEXT_PUBLIC_PEER_HOST, 
          port: Number(process.env.NEXT_PUBLIC_PEER_PORT),
          secure: Boolean(process.env.NEXT_PUBLIC_PEER_SECURE)
        })
        setPeer(localPeer)

        localPeer.on('open', () => {
          if (userId !== localPeer.id) {
            setUserId(localPeer.id)
          }
          if (localPeer.id) {
            socket.emit('join-room', roomId, localPeer.id)
          }
        })

        localPeer.on('error', err => setError(err))
      })

      return function cleanup() {
        if (peer) {
          peer.destroy()
        }
      }
    },
    [opts.userId, stream]
  )

  return [
    userId,
    peer,
    error
  ]
}

export interface PeerError {
  type: string;
  message: string;
}

export interface PeerCall { 
  peerId: string
  stream: MediaStream
  connection: MediaConnection
}

export default usePeerState