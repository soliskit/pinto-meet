import Pusher from 'pusher'

const {
  APP_ID: appId,
  KEY: key,
  SECRET: secret,
  CLUSTER: cluster,
} = process.env

const pusher = new Pusher({
  appId,
  key,
  secret,
  cluster,
})

module.exports = async (req, res) => {
  const {
    query: { userid, roomid },
  } = req

  try {
    await new Promise((resolve, reject) => {
      pusher.trigger(
        'room-events',
        'join-room',
        { roomid, userid }
      )
    })
    res.status(200).end('sent event succesfully')
  } catch (e) {
    console.log(e.message)
  }
}
