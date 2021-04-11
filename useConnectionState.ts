import Peer, { MediaConnection } from 'peerjs'
import { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import PeerCall from './types/peer-call'

const useConnectionState = (
  peer: Peer,
  socket: Socket,
  stream: MediaStream | null
): [PeerCall[]] => {
  const [calls, setCalls] = useState<PeerCall[]>([])

  useEffect(() => {
    if (!peer || !socket || !stream) {
      return
    }
    
    peer.on('call', (call) => {
      if (!stream) {
        console.error('stream is null')
        return
      }
      const peerId = call.peer
      call.answer(stream)
      addCallToPeers(peerId, call)
    })

    socket.on('user-connected', (peerId: string) => {
      if (!stream) {
        console.error('stream is null')
        return
      }
      const call = peer.call(peerId, stream)
      addCallToPeers(peerId, call)
    })

    socket.on('user-disconnected', (peerId: string) => {
      removeCallFromPeersByUserId(peerId)
    })
  }, [peer, stream])

  const addCallToPeers = (peerId: string, call: MediaConnection) => {
    call.on('stream', (peerVideoStream: MediaStream) => {
      const peerCall: PeerCall = {
        peerId: peerId,
        stream: peerVideoStream,
        connection: call
      }

      setCalls((previousCalls) => {
        let callExists = false
        let callIndex = 0
        for (let i = 0; i < previousCalls.length; i++) {
          const previousCall = previousCalls[i]
          callExists = previousCall.peerId === peerCall.peerId
          if (callExists) {
            callIndex = i
          }
        }
        if (callExists) {
          previousCalls[callIndex] = peerCall
          return [...previousCalls]
        } else {
          return [...previousCalls, peerCall]
        }
      })
    })
    call.on('close', () => {
      setCalls((previousCalls) =>
        previousCalls.filter((peerCall) => peerCall.peerId !== peerId)
      )
    })

    call.on('error', (error) => console.error(error))
  }

  const removeCallFromPeersByUserId = (userId: string) => {
    setCalls((previousCalls) => {
      const openCall = previousCalls.find(
        (peerCall) => peerCall.peerId === userId
      )
      if (openCall) {
        openCall.connection.close()
      }
      const newCalls = previousCalls.filter(
        (peerCall) => peerCall.peerId !== userId
      )
      return newCalls
    })
  }

  return [calls]
}

export default useConnectionState
