const express = require('express')
require('dotenv').config()
const cors = require('cors')
const { getConnectionMongo } = require('./db/db-connect-mongo')
const generoRouter = require('./router/genero')
const directorRouter = require('./router/director')
const productoraRouter = require('./router/productora')
const tipoRouter = require('./router/tipo')
const mediaRouter = require('./router/media')

const port = process.env.port
const app = express()

getConnectionMongo()

app.use(cors())

// Parseo JSON
app.use(express.json())

app.use('/genero', generoRouter)
app.use('/director', directorRouter)
app.use('/productora', productoraRouter)
app.use('/tipo', tipoRouter)
app.use('/media', mediaRouter)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
