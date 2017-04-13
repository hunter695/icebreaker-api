import config from '../config' // keys for twitter API

const mongodb = require('mongodb')
const parse = require('csv-parse')
const fs = require('fs')
const path = require('path')

const mongodbURL = config.mongodb.url
const MongoClient = mongodb.MongoClient

module.exports = {
  /**
   * Parses csv file calling parse_file() and store into MongoDB
   * @param {string} col MongoDB collection name to insert into.
   * @param {string} filePath is the path to the csv file.
   */
  load(col, filePath) {
    // connect to MongoDB
    MongoClient.connect(mongodbURL, (mongodbError, db) => {
      if (mongodbError) {
        throw Error(`Unable to connect, error: ${mongodbError}`)
      } else {
      // parse csv files
        const list = []
        const storelines = []
        // array 'list' contains one row of all entries in pairs
        const parser = parse({ delimiter: ',' }, (err, data) => {
          if (err) {
            throw Error(`File ${filePath} parsing error: ${err}`)
          } else {
            list.push(data)
            const row = list[0]
            // gets list with pickupline and author
            for (let i = 1; i < list[0].length; i += 1) {
              storelines.push({
                text: row[i][0],
                author: row[i][1],
                likes: 0,
                dislikes: 0,
              })
            }
          }
          // store formated array of pickup lines into Mongo
          const collection = db.collection(col)
          collection.insert(storelines, (insertError) => {
            // console.log(`DB insert result: ${records.ops[0]._id}`)
            if (insertError) {
              throw Error(`insert error: ${insertError}`)
            }
            db.close()
          })
        })
        // streams from csv location while parsing is busy
        fs.createReadStream(path.join(__dirname, filePath)).pipe(parser)
      }
    })
  },
  drop(collection) {
    MongoClient.connect(mongodbURL, async (mongodbError, db) => {
      try {
        const cursor = await db.collection(collection).findOne()
        if (cursor) {
          await db.collection(collection).drop()
        }
      } catch (err) {
        throw Error(err)
      } finally {
        db.close()
      }
    })
  },
}
