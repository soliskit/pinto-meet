import { useEffect, useState, useRef } from 'react';
import Peer from 'peerjs';
// import { PeerError } from './types';
// copied partially from https://github.com/madou/react-peer/blob/master/src/use-peer-state.tsx
const usePeerState = <TState extends {}>(
  initialState: TState,
  opts: { userId: string } = { userId: '' }
): [TState, Function, string] => {
//   const [connections, setConnections] = useState<Peer.DataConnection[]>([]);
  const [state, setState] = useState<TState>(initialState);
//   const [error, setError] = useState<PeerError | undefined>(undefined);
  // We useRef to get around useLayoutEffect's closure only having access
  // to the initial state since we only re-execute it if userId changes.
  const stateRef = useRef<TState>(initialState);
  const [peer, setPeer] = useState<Peer | undefined>(undefined);
  const [userId, setUserId] = useState(opts.userId);

  useEffect(
    () => {
      import('peerjs').then(({ default: Peer }) => {
        const localPeer = new Peer(opts.userId);
        setPeer(localPeer);

        localPeer.on('open', () => {
          if (userId !== localPeer.id) {
            setUserId(localPeer.id);
          }
        });

        // localPeer.on('error', err => setError(err));

        // localPeer.on('connection', conn => {
        //   setConnections(prevState => [...prevState, conn]);

        //   // We want to immediately send the newly connected peer the current data.
        //   conn.on('open', () => {
        //     conn.send(stateRef.current);
        //   });
        // });
      });

      return () => {
        peer && peer.destroy();
      };
    },
    [opts.userId]
  );

  return [
    state,
    (newState: TState) => {
      setState(newState);
      stateRef.current = newState;
    //   connections.forEach(conn => conn.send(newState));
    },
    userId,
    // connections,
    // error,
  ];
};

export default usePeerState;