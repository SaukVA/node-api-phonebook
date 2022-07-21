const { model, Schema } = require('mongoose')

const personSchema = new Schema({
  name: String,
  number: String
})

// Transformación que le hacemos a los objetos que se devuelven de la base de datos
personSchema.set('toJSON', {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id
    delete returnObject._id
    delete returnObject.__v
  }
})

const Person = model('Person', personSchema)

module.exports = Person
