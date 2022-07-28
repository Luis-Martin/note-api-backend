const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

let notes = [
  {
    id: 1,
    content: "HTML is easy to learn",
    date: "2022-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Jaevascript",
    date: "2022-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-05-30T19:20:14.298Z",
    important: true
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api', (request, response) => {
  response.send('<a href="http://localhost:3001/api/notes">notes</a>')
})

app.get('/api/notes', (request, response) => {
  // console.log(request.headers)
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  
  if (note) {
    response.status(200).json(note)
  } else {
    response.statusMessage = "This note does not exist"
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  
  response.status(204).end()
})

const generateId = () => {
  const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids) 
  
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    id: generateId(),
    content: body.content,
    date: new Date(),
    important: body.important || false,
  }

  notes = notes.concat(note)

  response.json(note)
})

app.put('/api/notes/:id', (request, response) => {
  const noteToChange = request.body
  const id = request.body.id
  notes = notes.map(note => (note.id !== id) ? note : noteToChange )
  response.send(noteToChange)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: `unknown endpoint - ${request.path}` })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})