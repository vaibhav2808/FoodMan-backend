const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
const morgan = require('morgan')
const databaseConfig = require('./config/database')
const passport = require('passport')
const JwtStrategy = require('./auth/jwt')
const cors = require('cors')
const fs = require('fs')
const dataJson = fs.readFileSync('./data.json')
const data = JSON.parse(dataJson)

const chillMode = data.filter((item) => item.counts > 200)
const godMode = data.filter((item) => item.counts < 200)

const { errorHandler } = require('./middlewares/error')
const route = require('./routes/index')

const logger = morgan('dev')

passport.use('jwt', JwtStrategy)
app.use(cors())
app.use(logger)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', route)
app.get('/chillMode/getRandomWord', (req, res) => {
  const randomIndex = Math.floor(Math.random() * chillMode.length)
  res.json(chillMode[randomIndex])
})

app.get('/godMode/getRandomWord', (req, res) => {
  const randomIndex = Math.floor(Math.random() * godMode.length)
  res.json(godMode[randomIndex])
})

app.use(errorHandler)
mongoose.connect(databaseConfig.url, databaseConfig.options).then(() => {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
}
).catch(err => {
  console.log(err)
})
