require('dotenv').config()
const mongoose = require('mongoose')

const connectionString = process.env.MONGO_DB_URI

// Conexion con la BD
mongoose.connect(connectionString)
  .then(console.log('Conexión con la BD'))
  .catch(err => console.error(err))
