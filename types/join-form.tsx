import Haikunator from 'haikunator'
import router from 'next/router'
import { SyntheticEvent, useState } from 'react'

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
    <div className='pt-10'>
      <h1 className='pb-5'>
          Open room: {name}
      </h1>
      <form
        id={`join-${name}`}
        className='pb-5'>
        <input
          type='text'
          value={name}
          className='pl-3 py-3 md:pl-6 md:py-6 w-5/6 md:w-1/3 rounded-lg bg-yellow-100'
          onChange={updateName}
          placeholder='Enter room name'/>
      </form>
      <button
          type='submit'
          form={`join-${name}`}
          className='py-3 md:py-6 w-5/6 md:w-1/3 text-lg rounded-lg bg-yellow-800'
          autoFocus={true}
          onClick={handleSubmission}>
            Open
        </button>
    </div>
  )
}

export default JoinForm
