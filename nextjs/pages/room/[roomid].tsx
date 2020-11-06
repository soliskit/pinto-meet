import { useRouter } from 'next/router'
import useSWR from 'swr'
import usePeerState from '../../usePeerState'

const fetcher = (...args) => fetch(...args).then(res => res)

const Room = () => {
  const router = useRouter()
  const { roomid } = router.query
  const [state, setState, userid] = usePeerState({})
  const _ = useSWR('/api/user/'+ userid + '/room/' + roomid + '/join', fetcher)

  return <p>Room: {roomid}, User: {userid}</p>
}

export default Room