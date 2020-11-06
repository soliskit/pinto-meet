import { useRouter } from 'next/router'
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res)

const Room = () => {
  const router = useRouter()
  const { roomid } = router.query
  const userid = "1"
  if (roomid) {
    const _ = useSWR('/api/user/'+ userid + '/room/' + roomid + '/join', fetcher)
  }

  return <p>Room: {roomid}</p>
}

export default Room