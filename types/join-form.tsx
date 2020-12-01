import Haikunator from 'haikunator'
import { SyntheticEvent, useRef, useState } from 'react'
import styles from '../styles/Home.module.css'

const JoinForm = () => {
  const haikunator = new Haikunator({ defaults: { tokenLength: 0 } })
  const roomPath = useRef<string>(`room/${haikunator.haikunate()}`)
  const [name, setName] = useState<string>('')

  const updateName = (event: SyntheticEvent) => {
    setName((event.target as HTMLInputElement).value.toLowerCase())
  }

  const handleSubmission = (event: SyntheticEvent) => {
    event.preventDefault()
    const inputValue = (((event.target as HTMLFormElement).form as HTMLFormElement)[0] as HTMLInputElement).value.trim()
    if (inputValue === '') {
      window.location.pathname = `/${roomPath.current}`
    } else {
      const path = inputValue.replace('/', '-').replace('\\', '-')
      window.location.pathname = `/room/${path}`
    }
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
