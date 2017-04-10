module.exports = {
  /**
   * Randomly samples a document from 'wildcard' database.
   * @param {object} db database from MongoDB connection.
   * @param {string} col collection name of wildcard database.
   * @param {string} amount amount of randomly selected documents to retrieve.
   * @return {object} promise to retrieve a randomly selected document.
   */
  sampleWildcard(db, col, amount) {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject('ERROR: invalid database!')
      }
      const cursor = db.collection(col)
      .aggregate([{ $sample: { size: amount } }])
      cursor.each((err, doc) => {
        if (doc) {
          resolve(doc)
        } else {
          reject('ERROR: Unable to retrieve document')
        }
      })
    })
  },
  /**
   * increments likes of document with _id id by amount
   * @param {object} db database from MongoDB connection
   * @param {string} callback collection name for database.
   * @param {object} id of document to update.
   * @param {integer} amount of likes to increment
   */
  addLikes(db, col, id, amount) {
    if (!db) {
      throw Error('ERROR: invalid database!')
    } else {
      return db.collection(col).update({ _id: id }, { $inc: { likes: amount } })
    }
  },
  /**
   * increments dislikes of document with _id id by amount
   * @param {object} db database from MongoDB connection
   * @param {string} callback collection name for database.
   * @param {object} id of document to update.
   * @param {integer} amount of likes to increment
   */
  addDislikes(db, col, id, amount) {
    if (!db) {
      throw Error('ERROR: invalid database!')
    } else {
      return db.collection(col).update({ _id: id }, { $inc: { dislikes: amount } })
    }
  },
  /**
   * Stores tweets into MongoDB database col
   * @param {ibject} db MongoDB database connection
   * @param {col} col MongoDB collection to store in.
   * @param {object} content the object to store into MongoDB database.
   * @return {string} the id of inserted content.
   */
  async storeOne(db, col, content) {
    let result
    if (!db) {
      throw Error('ERROR: invalid database!')
    } else {
      try {
        result = await db.collection(col).insertOne(content)
      } catch (storeErr) {
        throw Error(storeErr)
      }
      return result.insertedId
    }
  },
}
