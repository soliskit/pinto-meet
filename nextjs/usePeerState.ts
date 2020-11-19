import { useEffect, useState } from 'react'
import Peer from 'peerjs'
import { Socket } from 'socket.io-client'
import PeerError from './types/peer-error'

// copied partially from https://github.com/madou/react-peer/blob/master/src/use-peer-state.tsx
const usePeerState = (
  opts: { userId: string | undefined, roomId: string, socket: Socket } = { userId: undefined, roomId: undefined, socket: undefined }
): [string | undefined, Peer, PeerError | undefined] => {
  const [error, setError] = useState<PeerError | undefined>(undefined)
  const [peer, setPeer] = useState<Peer | undefined>(undefined)
  const [userId, setUserId] = useState(opts.userId)
  const socket = opts.socket
  const roomId = opts.roomId

  useEffect(
    () => {
      if (!socket) {
        return
      }
      import('peerjs').then(({ default: Peer }) => {
        let localPeer: Peer | undefined
        setPeer((currentPeer) => {
          if (!currentPeer) {
            localPeer = new Peer(opts.userId, { host: process.env.NEXT_PUBLIC_PEER_HOST, secure: true })
            return localPeer
          } else {
            localPeer = currentPeer
            return currentPeer
          }
        })

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

      return function cleanup () {
        if (peer) {
          peer.destroy()
        }
      }
    },
    [opts.userId, socket]
  )

  return [
    userId,
    peer,
    error
  ]
}

export default usePeerState
