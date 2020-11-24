import styles from '../styles/Home.module.css'
import { useState } from 'react'
import Link from 'next/link'
import Haikunator from 'haikunator'

const JoinForm = () => {
  const haikunator = new Haikunator({ defaults: { tokenLength: 0 } })
  const [name, setName] = useState<string>(undefined)
  const [roomName, setRoomName] = useState<string>(`room/${haikunator.haikunate()}`)

  const updateName = (event) => {
    setName(event.target.value)
    setRoomName(`room/${ event.target.value }`)
  }

  return (
    <div className={styles.join_room}>
      <h1 className={styles.form}>Open room: {name}</h1>
      <form className={styles.join_room}>
        <input 
          type="text" 
          value={name} 
          onChange={updateName} 
          className={styles.form}
          placeholder='Enter room name'/>
      </form>
      <Link href={roomName}>
        <button type='button' autoFocus={true} className={styles.form}>
          Open
        </button>
      </Link>
    </div>
  )
}

export default JoinForm
