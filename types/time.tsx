import { useEffect, useState } from 'react'

const Time = () => {
  const [date, setDate] = useState(new Date())
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
  const weekdays = ['Sun', 'Mon', 'Tues', 'Weds', 'Thur', 'Fri', 'Sat']
  const hour = date.getHours()
  const minute = checkMinutes(date.getMinutes())
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const weekday = weekdays[date.getDay()]
  const month = months[date.getMonth()]
  const day = date.getDate()

  useEffect(() => {
    const timerID = setInterval( () => tick(), 1000 )
    return function cleanup () {
      clearInterval(timerID)
    }
  })
  
  function checkMinutes(m) {
    if (m < 10) {
      m = '0' + m
    }
    return m
  }
  function tick() {
    setDate(new Date())
  }

  return <time>{hour}:{minute} {ampm}&nbsp; • &nbsp;{weekday}, &nbsp;{month} {day}</time>
}

export default Time