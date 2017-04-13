import { sampleWildcard, addLikes, storeObject, storeContribution } from '../mongodb'
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

it('curated csv database addLikes test', () => {
  mongodb.MongoClient.connect(config.mongodb.url, async (connectErr, db) => {
    expect(db).toBeTruthy()
    let currentLikes
    let cursor

    // find a curated document for testing
    try {
      // find the inserted document by its returned ID.
      cursor = await db.collection('icebreaker_curated').findOne()
      currentLikes = cursor.likes
    } catch (findErr) {
      expect(findErr).toBeFalsy()
    }
    const objectId = cursor._id

    // add 10 likes to the retrieved document
    try {
      await addLikes(db, 'icebreaker_curated', objectId, 10)

    } catch (updateErr) {
      expect(updateErr).toBeFalsy()
    }

    // find the document the test added 10 likes to.
    try {
      // find the inserted document by its returned ID.
      cursor = await db.collection('icebreaker_curated').findOne({ _id: objectId }, {})
    } catch (findErr) {
      expect(findErr).toBeFalsy()
    }

    // verify that the difference is 10
    expect(cursor.likes - currentLikes).toBe(10)
    
    // reset the value so nothing is changed at the end of this test
    try {
      // find the inserted document by its returned ID.
      await db.collection('icebreaker_curated').update({ _id: objectId }, { $set: {likes:currentLikes}})
    } catch (updateErr) {
      expect(updateErr).toBeFalsy()
    }
    db.close()
  })
})
