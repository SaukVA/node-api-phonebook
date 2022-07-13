const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

morgan.token('body', req => { return JSON.stringify(req.body) })

app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())

let phonebook = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-6423122'
  }
]

app.get('/', (request, response) => {
  response.json('<h1>PhoneBook-API</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const persons = phonebook.filter(data => data.id === id)
  response.json(persons)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  phonebook = phonebook.filter(data => data.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const person = request.body
  const ids = phonebook.map(person => person.id)
  const idMax = Math.max(...ids)
  const personExist = phonebook.find(per => per.name === person.name)

  if (!person || !person.name || !person.number) {
    return response.status(400).json([{
      error: 'person.content is missing'
    }])
  }

  if (personExist) {
    return response.status(400).json([{
      error: 'name must be unique'
    }])
  }

  const newPeson = {
    id: idMax + 1,
    name: person.name,
    number: person.number
  }

  phonebook = [...phonebook, newPeson]

  response.json(newPeson)
})

app.get('/info', (request, response) => {
  response.send(
    '<p>Phone book has info for' + phonebook.length + '</p>' +
        '<p>' + new Date() + '</p>'
  )
})

app.use((reques, response) => {
  response.status(404).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
