/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname })
})

app.get('/script.js', (req, res) => {
  // sendFile() sets Content-Type response HTTP header field based on filename extension
  res.sendFile('script.js', { root: __dirname })
})

app.listen(5000, () => {
  console.dir('Test node client server listening on http://localhost:5000')
})
