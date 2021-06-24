import { useEffect, useRef } from 'react'
import { io, Socket, ManagerOptions, SocketOptions } from 'socket.io-client'

const useSocketState = (): Socket | undefined => {
  const socketRef = useRef<Socket | undefined>(undefined)
  const socketOptions: Partial<ManagerOptions & SocketOptions> = {
    path: `/${process.env.NEXT_PUBLIC_KEY}.io`,
    rememberUpgrade: true
  }

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_NODE_ENV === 'production') {
      socketRef.current = io(
        `https://${process.env.NEXT_PUBLIC_HOST}`,
        socketOptions
      )
    } else {
      socketRef.current = io(
        `http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}`,
        socketOptions
      )
    }

    socketRef.current?.on('disconnect', (reason: string) => {
      console.dir(reason)
      switch (reason) {
        case 'io client disconnect':
          console.log('Socket manually disconnected by client')
          break
        case 'io server disconnect':
          console.log('Socket manually disconnected by server')
          break
        case 'ping timeout':
          console.error(
            'Server failed to send PING packet within timeout range'
          )
          break
        case 'transport close':
          console.log('User lost connection or network was changed')
          break
        case 'transport error':
          console.error('Connection encountered server error')
          break
        case 'forced close':
          console.log('User left room')
          break
        default:
          console.error('Socket disconnected for unknown reason')
      }
    })

    socketRef.current?.on('connect', () => {
      console.dir('io client connect')
      console.log(
        `${socketRef.current?.id} - connected: ${socketRef.current?.connected}`
      )
    })

    return function cleanup() {
      socketRef.current?.disconnect()
      socketRef.current = undefined
    }
  }, [])

  return socketRef.current
}

export default useSocketState
