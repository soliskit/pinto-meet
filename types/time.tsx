import { useEffect, useState } from 'react'

const Time = () => {
  const [date, setDate] = useState(new Date())
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
  const weekdays = ['Sun', 'Mon', 'Tues', 'Weds', 'Thur', 'Fri', 'Sat']

  const checkHours = (h: number): number => {
    if (h == 0) {
      return 12
    } else {
      return h
    }
  }

  const checkMinutes = (m: number): string => {
    let minute = `${m}`
    if (m < 10) {
      minute = `0${m}`
    }
    return minute
  }

  const tick = () => {
    setDate(new Date())
  }

  const hour = checkHours((date.getHours() % 12))
  const minute = checkMinutes(date.getMinutes())
  const ampm: string = hour >= 12 ? 'PM' : 'AM'
  const weekday = weekdays[date.getDay()]
  const month = months[date.getMonth()]
  const day = date.getDate()

  useEffect(() => {
    const timerID = setInterval( () => tick(), 1000 )
    return function cleanup () {
      clearInterval(timerID)
    }
  })

  return <time>{hour}:{minute} {ampm}&nbsp; • &nbsp;{weekday}, &nbsp;{month} {day}</time>
}

export default Time
