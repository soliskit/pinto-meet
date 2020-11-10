import { useEffect, useState, useRef } from 'react';
import Peer, { MediaConnection } from 'peerjs';
import { Socket } from 'socket.io-client';

// copied partially from https://github.com/madou/react-peer/blob/master/src/use-peer-state.tsx
const usePeerState = (
  stream: MediaStream,
  opts: { userId: string | undefined, socket: Socket, } = { userId: undefined, socket: undefined }
): [string | undefined, PeerCall[], PeerError | undefined] => {
//   const [connections, setConnections] = useState<Peer.DataConnection[]>([]);
//   const [state, setState] = useState<TState>(initialState);
  const [error, setError] = useState<PeerError | undefined>(undefined)
  // We useRef to get around useLayoutEffect's closure only having access
  // to the initial state since we only re-execute it if userId changes.
//   const stateRef = useRef<TState>(initialState);
  const [peer, setPeer] = useState<Peer | undefined>(undefined);
  const [userId, setUserId] = useState(opts.userId);
  const [calls, setCalls] = useState<PeerCall[]>([])
  const socket = opts.socket

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
          if(localPeer.id) {
            socket.emit("join-room", "6", localPeer.id)
          }
        });

        localPeer.on("call", call => {
          const peerId = call.peer
          call.answer(stream)
          addCallToPeers(peerId, call)
        })

        socket.on("user-connected", function (peerId) {
            if(!stream) {
              console.error("stream is null")
              return
            }
            const call = localPeer.call(peerId, stream)
            addCallToPeers(peerId, call)
        })

        function addCallToPeers(peerId: string, call: MediaConnection) {
          call.on("stream", (peerVideoStream: MediaStream) => {
            const peerCall: PeerCall = {
              peerId: peerId,
              stream: peerVideoStream
            }
            if(!calls.find((value) => value.peerId === peerCall.peerId)) {
              setCalls([...calls, peerCall])
            }
          })
          call.on("close", () => {
            setCalls(calls.filter((peerCall) => peerCall.peerId != peerId))
          })

          call.on("error", (error) => setError(error))
          // peers[userId] = call
        }

        localPeer.on('error', err => setError(err))

        // localPeer.on('connection', conn => {
        //   setConnections(prevState => [...prevState, conn]);

        //   // We want to immediately send the newly connected peer the current data.
        //   conn.on('open', () => {
        //     conn.send(stateRef.current);
        //   });
        // });
      });

      return function cleanup() {
        if(peer) {
          peer.destroy();
        }
      };
    },
    [opts.userId, stream]
  );

  return [
    userId,
    calls,
    // connections,
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
}

// class PeerCalls extends Array<PeerCall> {
//   insert(peerCall: PeerCall): Array<PeerCall> {
//     if(!this.find((value) => value.peerId === peerCall.peerId)) {
//       return [...this, peerCall]
//     } else {
//       return this
//     }
//   }
// }

export default usePeerState;