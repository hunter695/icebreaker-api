import express from 'express'
import mongodb from 'mongodb'
import bodyParser from 'body-parser'
import config from './src/config'
import {
  getRandomDocument, storeContribution, adjustLikes,
} from './src/mongodb'
import { getTweet } from './src/twitter'
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

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
    const tweet = await getTweet('icebreaker', 7)
    const userSubmittedWildcard = await getRandomDocument(db, ICEBREAKER_WILD)
    res.send(Math.random() < .5 ? tweet : userSubmittedWildcard)
  } else {
    res.send(await getRandomDocument(db, ICEBREAKER_CURATED))
  }
})

app.get('/pickup', async (req, res) => {
  if (req.query.wild === 'true') {
    const tweet = await getTweet('pickupline', 7)
    const userSubmittedWildcard = await getRandomDocument(db, PICKUP_WILD)
    res.send(Math.random() < .5 ? tweet : userSubmittedWildcard)
  } else {
    res.send(await getRandomDocument(db, PICKUP_CURATED))
  }
})

app.post('/icebreaker', async (req, res) => {
  try {
    const id = await storeContribution(db, ICEBREAKER_WILD, req.body.text, req.body.author)
    res.status(200).send({ id })
  } catch (e) {
    res.send(e)
  }
})

app.post('/pickup', async (req, res) => {
  try {
    const id = await storeContribution(db, PICKUP_WILD, req.body.text, req.body.author)
    res.status(200).send({ id })
  } catch (e) {
    res.send(e)
  }
})

app.post('/like', (req, res) => {
  let { collection, id, amount } = req.body
  amount = parseInt(amount)
  const o_id = mongodb.ObjectID(id)
  console.log(o_id)
  adjustLikes(db, collection, o_id, amount)
  res.status(200).send()
})

MongoClient.connect(mongodbURL, (err, database) => {
  db = database
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
})
