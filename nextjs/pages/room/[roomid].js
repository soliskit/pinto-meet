import { useRouter } from 'next/router'

const Room = () => {
  const router = useRouter()
  const { roomid } = router.query

  return <p>Room: {roomid}</p>
}

export default Room