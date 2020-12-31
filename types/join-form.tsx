import Haikunator from 'haikunator'
import router from 'next/router'
import { SyntheticEvent, useState } from 'react'
import styles from '../styles/Home.module.css'

const JoinForm = () => {
  const [name, setName] = useState<string>('')

  const updateName = (event: SyntheticEvent) => {
    setName((event.target as HTMLInputElement).value.toLowerCase())
  }

  const handleSubmission = (event: SyntheticEvent) => {
    event.preventDefault()
    let path = name.trim()
    if (path === '') {
      const haikunator = new Haikunator({ defaults: { tokenLength: 0 } })
      path = haikunator.haikunate()
    }
    router.push(`/room/${encodeURIComponent(path)}`)
  }

  return (
    <div className={styles.join_room}>
      <h1
        className={styles.form}>
          Open room: {name}
      </h1>
      <form
        id={`join-${name}`}
        className={styles.join_room}>
        <input
          type='text'
          value={name}
          className={styles.form}
          onChange={updateName}
          placeholder='Enter room name'/>
      </form>
      <button
        type='submit'
        form={`join-${name}`}
        className={styles.form}
        autoFocus={true}
        onClick={handleSubmission}>
          Open
      </button>
    </div>
  )
}

export default JoinForm
