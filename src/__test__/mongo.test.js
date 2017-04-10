import { sampleWildcard, storeOne } from '../mongodb'
import config from '../config' // for Twitter API keys and MongoDB URL

const mongodb = require('mongodb')

it('Should be able to connect to MongoDB.', () => {
  mongodb.MongoClient.connect(config.mongodb.url, async (connectErr, db) => {
    expect(connectErr).toBeFalsy()
    db.close()
  })
})

it('Stored document text should be retrieved.', () => {
  mongodb.MongoClient.connect(config.mongodb.url, async (connectErr, db) => {
    expect(connectErr).toBeFalsy()
    let insertedId
    const content = {
      text: 'tasty meatloaf',
      author: 'Gordon Ramsay',
      likes: 2,
      dislikes: 123,
    }
    try {
      // store into temporary collection 'test' the content.
      insertedId = await storeOne(db, 'test', content)
      let cursor
      try {
        // find the inserted document by its returned ID.
        cursor = await db.collection('test').findOne({ _id: insertedId }, {})
      } catch (findErr) {
        expect(findErr).toBeFalsy()
      }
      const text = cursor.text
      expect(text).toBe('tasty meatloaf')
      db.collection('test').remove({ _id: insertedId })
    } catch (storeErr) {
      expect(storeErr).toBeFalsy()
    }
    db.close()
  })
})

it('Randomly sampling collection should return truthy', () => {
  mongodb.MongoClient.connect(config.mongodb.url, async (connectErr, db) => {
    expect(connectErr).toBeFalsy()
    let insertedId
    const content = {
      text: 'tasty meatloaf',
      author: 'Gordon Ramsay',
      likes: 2,
      dislikes: 123,
    }
    try {
      insertedId = await storeOne(db, 'test', content)
      const sample = await sampleWildcard(db, 'test', 1)
      expect(sample.text).toBeTruthy()
      db.collection('test').remove({ _id: insertedId })
    } catch (storeErr) {
      expect(storeErr).toBeFalsy()
    }
    db.close()
  })
})
