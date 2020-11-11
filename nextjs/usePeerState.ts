import { useEffect, useState } from 'react';
import Peer, { MediaConnection } from 'peerjs';
import { Socket } from 'socket.io-client';

// copied partially from https://github.com/madou/react-peer/blob/master/src/use-peer-state.tsx
const usePeerState = (
  stream: MediaStream,
  opts: { userId: string | undefined, roomId: string, socket: Socket } = { userId: undefined, roomId: undefined, socket: undefined }
): [string | undefined, PeerCall[], PeerError | undefined] => {
  const [error, setError] = useState<PeerError | undefined>(undefined)
  const [peer, setPeer] = useState<Peer | undefined>(undefined);
  const [userId, setUserId] = useState(opts.userId);
  const [calls, setCalls] = useState<PeerCall[]>([])
  const socket = opts.socket
  const roomId = opts.roomId

  const localCalls: PeerCall[] = []
  useEffect(
    () => {
      import('peerjs').then(({ default: Peer }) => {
        const localPeer = new Peer(opts.userId, { 
          host: process.env.NEXT_PUBLIC_PEER_HOST, 
          port: Number(process.env.NEXT_PUBLIC_PEER_PORT),
          secure: Boolean(process.env.NEXT_PUBLIC_PEER_SECURE)
        })
        setPeer(localPeer);

        localPeer.on('open', () => {
          if (userId !== localPeer.id) {
            setUserId(localPeer.id);
          }
          if (localPeer.id) {
            socket.emit("join-room", roomId, localPeer.id)
          }
        });

        localPeer.on("call", call => {
          const peerId = call.peer
          call.answer(stream)
          addCallToPeers(peerId, call)
        })

        socket.on("user-connected", function (peerId) {
            if (!stream) {
              console.error("stream is null")
              return
            }
            const call = localPeer.call(peerId, stream)
            addCallToPeers(peerId, call)
        })

        socket.on("user-disconnected", userId => {
          removeCallFromPeersByUserId(userId)
        })

        function addCallToPeers(peerId: string, call: MediaConnection) {
          call.on("stream", (peerVideoStream: MediaStream) => {
            const peerCall: PeerCall = {
              peerId: peerId,
              stream: peerVideoStream, 
              connection: call
            }
            if (!calls.find((value) => value.peerId === peerCall.peerId)) {
              setCalls([...calls, peerCall])
              localCalls.push(peerCall)
            }
          })
          call.on("close", () => {
            setCalls(calls.filter((peerCall) => peerCall.peerId != peerId))
          })

          call.on("error", (error) => setError(error))
        }

        function removeCallFromPeersByUserId(userId: string) {
          console.error(`${localCalls.length} CALL ELEMENTS`)
          console.error(`USERID: ${userId}`)
          const openCall: PeerCall = localCalls.find((peerCall) => peerCall.peerId == userId)
          console.error(`OPENCALL: ${openCall}`)
          openCall.connection.close()
          setCalls(calls.filter((peerCall) => peerCall.peerId != openCall.peerId))
        }

        localPeer.on('error', err => setError(err))
      });

      return function cleanup() {
        if (peer) {
          peer.destroy();
        }
      };
    },
    [opts.userId, stream]
  );

  return [
    userId,
    calls,
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

export default usePeerState;