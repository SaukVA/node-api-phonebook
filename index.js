// Aplicación de las configuraciones de dotenv y la de mongo
require('dotenv').config()
require('./mongo')

// Importación de dependencias
const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')

// Inportación de los Modelo que se van a necesitar
const Person = require('./models/Person')

// Uso de Express y Cors para que la API se a más legible
// y facil de utilizar.
app.use(express.json())
app.use(cors())

// =======================================
// METODOS GET
// =======================================
app.get('/', (request, response) => {
  response.send('<h1>PhoneBook-API</h1>')
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
      mongoose.connection.close()
    })
    .catch(err => next(err))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .then(person => {
      response.json(person)
      mongoose.connection.close()
    })
    .catch(err => next(err))
})

// =======================================
// METODOS POST
// =======================================
app.post('/api/persons', (request, response, next) => {
  const person = request.body
  const newPerson = new Person({
    name: person.name,
    number: person.number
  })

  if (!person || !person.name || !person.number) {
    return response.status(400).json([{
      error: 'person.content is missing'
    }])
  }

  Person.find({ $or: [{ name: person.name }, { number: person.number }] })
    .then(person => {
      if (person.length !== 0) {
        mongoose.connection.close()
        return response.status(400).json([{ error: 'name must be unique' }])
      }
      newPerson.save()
        .then(savePerson => {
          response.json(savePerson)
          mongoose.connection.close()
        })
        .catch(err => next(err))
    })
    .catch(err => next(err))
})

// =======================================
// METODOS DELETE
// =======================================
app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndRemove(id)
    .then(person => {
      response.status(204).end()
      mongoose.connection.close()
    })
    .catch(err => next(err))
})

// Midelware para control de errores
app.use((err, reques, response) => {
  console.error(err)
  response.status(404).end()
})

// Apertura del puerto para la comunicación con la API
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
