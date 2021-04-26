import Haikunator from 'haikunator'
import router from 'next/router'
import { SyntheticEvent, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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
    <>
      <h2>Type name or press open to generate a room name</h2>
      <form id={`join-${name}`}>
        <input
          type='text'
          value={name}
          onChange={updateName}
          placeholder='Enter room name'
        />
      </form>
      <button
        type='submit'
        form={`join-${name}`}
        className='join-room'
        autoFocus={true}
        onClick={handleSubmission}
      >
        Open
      </button>
    </>
  )
}

export default JoinForm
