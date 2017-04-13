import { sampleWildcard, storeObject, storeContribution } from '../mongodb'
import config from '../config' // for Twitter API keys and MongoDB URL

const mongodb = require('mongodb')

it('Stored document text should be retrieved.', () => {
  mongodb.MongoClient.connect(config.mongodb.url, async (connectErr, db) => {
    expect(db).toBeTruthy()
    let insertedId
    const content = {
      text: 'tasty meatloaf',
      author: 'Gordon Ramsay',
      likes: 2,
      dislikes: 123,
    }
    try {
      // store into temporary collection 'test' the content.
      insertedId = await storeObject(db, 'test', content)
      let cursor
      try {
        // find the inserted document by its returned ID.
        cursor = await db.collection('test').findOne({ _id: insertedId }, {})
        expect(cursor).toBeTruthy()
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

it('Randomly sampling collection should return a document', () => {
  mongodb.MongoClient.connect(config.mongodb.url, async (connectErr, db) => {
    expect(db).toBeTruthy()
    let insertedId
    const content = {
      text: 'tasty meatloaf',
      author: 'Gordon Ramsay',
      likes: 2,
      dislikes: 123,
    }
    try {
      insertedId = await storeObject(db, 'test', content)
      const sample = await sampleWildcard(db, 'test', 1)
      expect(sample.text).toBeTruthy()
      db.collection('test').remove({ _id: insertedId })
    } catch (storeErr) {
      expect(storeErr).toBeFalsy()
    }
    db.close()
  })
})

it('storeContribution test', () => {
  mongodb.MongoClient.connect(config.mongodb.url, async (connectErr, db) => {
    expect(db).toBeTruthy()
    let insertedId
    const text = 'tasty meatloaf'
    const author = 'Gordon Ramsay'
    try {
      insertedId = await storeContribution(db, 'test', text, author)
      let cursor
      try {
        // find the inserted document by its returned ID.
        cursor = await db.collection('test').findOne({ _id: insertedId }, {})
        expect(cursor).toBeTruthy()
      } catch (findErr) {
        expect(findErr).toBeFalsy()
      }
      const retrievedText = cursor.text
      expect(retrievedText).toBe('tasty meatloaf')
      db.collection('test').remove({ _id: insertedId })
    } catch (storeErr) {
      expect(storeErr).toBeFalsy()
    }
    db.close()
  })
})
