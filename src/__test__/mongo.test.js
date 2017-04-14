import { sampleWildcard, storeObject, storeContribution } from '../mongodb'
import config from '../config' // for Twitter API keys and MongoDB URL

const mongodb = require('mongodb')

it('Stored document text should be retrieved.', async () => {
  const db = await mongodb.MongoClient.connect(config.mongodb.url)
  try {
    expect(db).toBeTruthy()

    const content = {
      text: 'tasty meatloaf',
      author: 'Gordon Ramsay',
      likes: 2,
      dislikes: 123,
    }
    // store into temporary collection 'test' the content.
    const insertedId = await storeObject(db, 'test', content)
    // find the inserted document by its returned ID.
    const cursor = await db.collection('test').findOne({ _id: insertedId }, {})
    expect(cursor).toBeTruthy()

    const text = cursor.text
    expect(text).toBe('tasty meatloaf')
    await db.collection('test').remove({ _id: insertedId })
  } finally {
    db.close()
  }
})

it('Randomly sampling collection should return a document', async () => {
  const db = await mongodb.MongoClient.connect(config.mongodb.url)
  try {
    expect(db).toBeTruthy()

    const content = {
      text: 'tasty meatloaf',
      author: 'Gordon Ramsay',
      likes: 2,
      dislikes: 123,
    }

    const insertedId = await storeObject(db, 'test', content)
    const sample = await sampleWildcard(db, 'test', 1)
    expect(sample.text).toBeTruthy()
    await db.collection('test').remove({ _id: insertedId })
  } finally {
    db.close()
  }
})

it('storeContribution test', async () => {
  const db = await mongodb.MongoClient.connect(config.mongodb.url)
  try {
    expect(db).toBeTruthy()

    const text = 'tasty meatloaf'
    const author = 'Gordon Ramsay'
    const insertedId = await storeContribution(db, 'test', text, author)
    // find the inserted document by its returned ID.
    const cursor = await db.collection('test').findOne({ _id: insertedId }, {})
    expect(cursor).toBeTruthy()
    const retrievedText = cursor.text
    expect(retrievedText).toBe('tasty meatloaf')
    await db.collection('test').remove({ _id: insertedId })
  } finally {
    db.close()
  }
})
