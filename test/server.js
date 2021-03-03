/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()
const express = require('express')
let stunUrl
const accountSid = process.env.NEXT_PUBLIC_ACCOUNT_SID
const authToken = process.env.NEXT_PUBLIC_AUTH_TOKEN
const client = require('twilio')(accountSid, authToken)
client.tokens.create().then(token => stunUrl = token.iceServers[0].urls)

const app = express()

app.set('view engine', 'ejs')
app.set('views', __dirname)

app.get('/script.js', (req, res) => {
  // sendFile() sets Content-Type response HTTP header field based on filename extension
  res.sendFile('script.js', { root: __dirname })
})

app.get('/:room', (req, res) => {
  res.render(
    'index', {
      roomId: req.params.room,
      stunUrl: stunUrl,
      key: process.env.NEXT_PUBLIC_KEY,
      host: process.env.NEXT_PUBLIC_HOST,
      env: process.env.NEXT_PUBLIC_NODE_ENV
    })
})

app.listen(5000, () => {
  console.dir('Test node client server listening on http://localhost:5000')
})
