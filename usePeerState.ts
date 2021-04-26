import Peer from 'peerjs'
import { useEffect, useState } from 'react'
import PeerError from './types/peer-error'

// copied partially from https://github.com/madou/react-peer/blob/master/src/use-peer-state.tsx
const usePeerState = (
  opts: { userId: string | undefined, stunUrl: string } = { userId: undefined, stunUrl: '' }
): [Peer, string | undefined, PeerError | undefined] => {
  const [peer, setPeer] = useState<Peer | null>(null)
  const [userId, setUserId] = useState(opts.userId)
  const [error, setError] = useState<PeerError | undefined>(undefined)

  useEffect(() => {
    import('peerjs').then(({ default: Peer }) => {
      let localPeer: Peer | undefined
      setPeer((currentPeer) => {
        if (!currentPeer) {
          const peerOptions: Peer.PeerJSOption = {
            key: process.env.NEXT_PUBLIC_KEY,
            host: process.env.NEXT_PUBLIC_HOST,
            debug: 2,
            config: {
              iceServers: [
                { urls: opts.stunUrl }
              ]
            }
          }
          if (process.env.NEXT_PUBLIC_NODE_ENV === 'production') {
            peerOptions.secure = true
          } else {
            peerOptions.port = Number(process.env.NEXT_PUBLIC_PORT)
          }
          localPeer = new Peer(opts.userId, peerOptions)
          return localPeer
        } else {
          localPeer = currentPeer
          return currentPeer
        }
      })

      localPeer?.on('open', () => {
        if (userId !== localPeer?.id) {
          setUserId(localPeer?.id)
        }
      })

      localPeer?.on('error', (err) => setError(err))
    })

    return function cleanup() {
      if (peer) {
        peer.destroy()
      }
    }
  }, [opts.userId])

  return [
    peer,
    userId,
    error
  ]
}

export default usePeerState
