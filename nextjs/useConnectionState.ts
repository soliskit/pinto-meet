import Peer, { MediaConnection } from 'peerjs'
import { useState } from 'react'
import { Socket } from 'socket.io-client'
import { PeerCall } from './usePeerState'

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
        setCalls([...calls, peerCall])
      }
    })
    call.on('close', () => {
      setCalls(calls.filter((peerCall) => peerCall.peerId != peerId))
    })

    // call.on("error", (error) => setError(error))
  }

  const removeCallFromPeersByUserId = (userId: string) => {
    console.error(`${calls.length} CALL ELEMENTS`)
    console.error(`USERID: ${userId}`)
    const openCall: PeerCall = calls.find((peerCall) => peerCall.peerId == userId)
    console.error(`OPENCALL: ${openCall}`)
    openCall.connection.close()
    setCalls(calls.filter((peerCall) => peerCall.peerId != openCall.peerId))
  }

  return [calls]
}

export default useConnectionState