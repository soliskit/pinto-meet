import Peer, { MediaConnection } from 'peerjs'
import { useState } from 'react'
import { Socket } from 'socket.io-client'
import PeerCall from './types/peer-call'

const useConnectionState = (peer: Peer, socket: Socket, stream: MediaStream): [PeerCall[]] => {
  const [calls, setCalls] = useState<PeerCall[]>([])

  if (!peer || !socket || !stream) {
    return [calls]
  }

  peer.on('call', call => {
    const peerId = call.peer
    call.answer(stream)
    addCallToPeers(peerId, call)
  })

  socket.on('user-connected', peerId => {
    if (!stream) {
      console.error('stream is null')
      return
    }
    const call = peer.call(peerId, stream)
    addCallToPeers(peerId, call)
  })

  socket.on('user-disconnected', peerId => {
    removeCallFromPeersByUserId(peerId)
  })

  const addCallToPeers = (peerId: string, call: MediaConnection) => {
    call.on('stream', (peerVideoStream: MediaStream) => {
      const peerCall: PeerCall = {
        peerId: peerId,
        stream: peerVideoStream,
        connection: call
      }
      if (!calls.find((value) => value.peerId === peerCall.peerId)) {
        setCalls(previousCalls => [...previousCalls, peerCall])
      }
    })
    call.on('close', () => {
      setCalls(previousCalls => previousCalls.filter((peerCall) => peerCall.peerId !== peerId))
    })

    // call.on("error", (error) => setError(error))
  }

  const removeCallFromPeersByUserId = (userId: string) => {
    setCalls(previousCalls => {
      console.error(previousCalls)
      const openCall = previousCalls.find((peerCall) => peerCall.peerId === userId)
      openCall.connection.close()
      return previousCalls.filter((peerCall) => peerCall.peerId !== userId)
    })
  }

  return [calls]
}

export default useConnectionState
