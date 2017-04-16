import express from 'express'
import mongodb from 'mongodb'
import bodyParser from 'body-parser'
import config from './src/config'
import { getRandomDocument, storeContribution } from './src/mongodb'
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const mongodbURL = config.mongodb.url
const MongoClient = mongodb.MongoClient

const ICEBREAKER_CURATED = 'icebreaker_curated'
const ICEBREAKER_WILD = 'icebreaker_wild'
const PICKUP_CURATED = 'pickupline_curated'
const PICKUP_WILD = 'pickupline_wild'

let db

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/icebreaker', async (req, res) => {
  if (req.query.wild === 'true') {
    res.send(await getRandomDocument(db, ICEBREAKER_WILD))
  } else {
    res.send(await getRandomDocument(db, ICEBREAKER_CURATED))
  }
})

app.get('/pickup', async (req, res) => {
  if (req.query.wild === 'true') {
    res.send(await getRandomDocument(db, PICKUP_WILD))
  } else {
    res.send(await getRandomDocument(db, PICKUP_CURATED))
  }
})

app.post('/icebreaker', async (req, res) => {
  console.log(req.body)
  try {
    const id = await storeContribution(db, ICEBREAKER_WILD, req.body.text, req.body.author)
    res.status(200).send({ id })
  } catch (e) {
    res.send(e)
  }
})

app.post('/pickup', async (req, res) => {
  console.log(req.body)
  try {
    const id = await storeContribution(db, PICKUP_WILD, req.body.text, req.body.author)
    res.status(200).send({ id })
  } catch (e) {
    res.send(e)
  }
})

MongoClient.connect(mongodbURL, (err, database) => {
  db = database
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
})
