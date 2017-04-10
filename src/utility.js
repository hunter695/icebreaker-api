module.exports = {
  /**
   * Stores tweets into MongoDB database 'wildcard'
   * @param {number} daysBack number of days back
   * @return {object} promise to resolve the date going back daysBack
   */
  getPastDate(daysBack) {
    return new Promise((resolve, reject) => {
      const today = new Date()
      const someDaysAgo = new Date(today.setDate(today.getDate() - daysBack))
      const year = someDaysAgo.getFullYear()
      let month = someDaysAgo.getMonth()
      month += 1
      const date = someDaysAgo.getDate()
      const result = `${year}-${month}-${date}`
      if (someDaysAgo) {
        resolve(result)
      } else {
        reject('ERROR: unable to get date')
      }
    })
  },
}
