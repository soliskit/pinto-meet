import Peer from 'peerjs'
import { useEffect, useRef, useState } from 'react'
import PeerError from './types/peer-error'

// copied partially from https://github.com/madou/react-peer/blob/master/src/use-peer-state.tsx
const usePeerState = (
  opts: { 
    userId: string | undefined, 
    stunUrl: string 
  } = { userId: undefined, stunUrl: ''}
  ): [
    Peer | null, string | undefined, 
    PeerError | undefined
  ] => {
  const peer = useRef<Peer | null>(null)
  const [userId, setUserId] = useState(opts.userId)
  const [error, setError] = useState<PeerError | undefined>(undefined)

  useEffect(() => {
    import('peerjs').then(({ default: Peer }) => {
      if (peer.current) {
        return
      }
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
      peer.current = new Peer(opts.userId, peerOptions)

      peer.current.on('open', (id) => {
        console.dir(`NEW PEER ID: ${id}`)
        setUserId(id)
      })

      peer.current.on('error', (err) => setError(err))
    })

    return cleanup()
  }, [])

  const cleanup = () => {
    console.dir('PEER: DESTORYED')
    peer.current?.destroy()
    peer.current = null
  }

  return [
    peer.current,
    userId,
    error
  ]
}

export default usePeerState
