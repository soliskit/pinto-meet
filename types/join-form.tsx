import { useState } from 'react'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

const JoinForm = (): JSX.IntrinsicElements['form'] => {
  const [name, setName] = useState(undefined)

  const updateName = (event) => {
    setName(event.target.value)
  }

  return (
    <div className={styles.join_room}>
      <h1 className={styles.form}>Join or open room: {name}</h1>
      <form className={styles.join_room}>
        <input 
          type="text" 
          value={name} 
          onChange={updateName} 
          className={styles.form}
          placeholder='Enter room name'/>
      </form>
      <Link href={`room/${name}`}><button type='button' autoFocus={true} className={styles.form}>Join</button></Link>
    </div>
  )
}

export default JoinForm
