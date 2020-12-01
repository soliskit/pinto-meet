import Peer from 'peerjs'
import { useEffect, useState } from 'react'
import PeerError from './types/peer-error'

// copied partially from https://github.com/madou/react-peer/blob/master/src/use-peer-state.tsx
const usePeerState = (
  opts: { userId: string | undefined } = { userId: undefined }
): [string | undefined, Peer, PeerError | undefined] => {
  const [error, setError] = useState<PeerError | undefined>(undefined)
  const [peer, setPeer] = useState<Peer | undefined>(undefined)
  const [userId, setUserId] = useState(opts.userId)

  useEffect(
    () => {
      import('peerjs').then(({ default: Peer }) => {
        let localPeer: Peer | undefined
        setPeer((currentPeer) => {
          if (!currentPeer) {
            let peerOptions: Peer.PeerJSOption = { 
              host: process.env.NEXT_PUBLIC_HOST, 
              secure: process.env.NEXT_PUBLIC_IS_SECURE === 'true'
            }
            if (process.env.NEXT_PUBLIC_PORT) {
              peerOptions.port = Number(process.env.NEXT_PUBLIC_PORT)
            }
            localPeer = new Peer(opts.userId, peerOptions)
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
        })

        localPeer.on('error', err => setError(err))
      })

      return function cleanup () {
        if (peer) {
          peer.destroy()
        }
      }
    },
    [opts.userId]
  )

  return [
    userId,
    peer,
    error
  ]
}

export default usePeerState
