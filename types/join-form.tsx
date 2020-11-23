import { useState } from 'react'
import Link from 'next/link'

const JoinForm = (): JSX.IntrinsicElements['form'] => {
  const [name, setName] = useState(undefined)

  const updateName = (event) => {
    setName(event.target.value)
  }

  return (
    <div>
      <h1>Join or open a room: {name}</h1>
      <form>
        <input 
          type="text" 
          value={name} 
          onChange={updateName} 
          placeholder='Please enter your name'/>
      </form>
      <Link href={`room/${name}`}><a>Join</a></Link>
    </div>
  )
}

export default JoinForm
