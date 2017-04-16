import express from 'express'
import mongodb from 'mongodb'
import config from './src/config'
import { getRandomDocument } from './src/mongodb'
const app = express()


const mongodbURL = config.mongodb.url
const MongoClient = mongodb.MongoClient

const ICEBREAKER_CURATED = 'icebreaker_curated'

let db

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/icebreaker', async (req, res) => {
  res.send(await getRandomDocument(db, ICEBREAKER_CURATED))
})

MongoClient.connect(mongodbURL, (err, database) => {
  db = database
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
})
