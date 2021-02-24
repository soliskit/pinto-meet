/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express')

const app = express()

app.set('view engine', 'ejs')
app.set('views', __dirname)

app.get('/:room', (req, res) => {
  res.render('index', { roomId: req.params.room })
})

app.get('/script.js', (req, res) => {
  // sendFile() sets Content-Type response HTTP header field based on filename extension
  res.sendFile('script.js', { root: __dirname })
})

app.listen(5000, () => {
  console.dir('Test node client server listening on http://localhost:5000')
})
