import { storeOne } from '../mongodb'
import config from '../config' // for Twitter API keys and MongoDB URL

const mongodb = require('mongodb')

it('Stored object text should be retrieved.', () => {
  mongodb.MongoClient.connect(config.mongodb.url, async (err, db) => {
    if(err) {
      throw Error(err)
    }
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
        cursor = await db.collection('test').findOne({_id: insertedId}, {})
      } catch(findErr) {
        throw Error(findErr)
      }
      const text = cursor.text
      expect(text).toBe('tasty meatloaf')
    } catch(storeErr) {
      throw Error(storeErr)
    }
    db.close()
  })
})
