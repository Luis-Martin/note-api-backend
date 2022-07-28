const express = require('express')
const app = express()

app.get('/', (request, response) => {
  response.send('Hello')
})

app.get('/api/notes', (request, response) => {
  response.json({note:1})
})

app.listen(5555)