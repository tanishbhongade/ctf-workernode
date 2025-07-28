const express = require('express')
const app = express()
const containerRoutes = require('./routes/containerRoutes')
const morgan = require('morgan')

app.use(morgan('dev'))
app.use(express.json())

app.use('/api/container', containerRoutes)

module.exports = app