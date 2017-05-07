/**
 * Get past data as a string.
 * @param {number} daysBack number of days back
 * @return {object} promise to resolve the date going back daysBack
 */
export function getPastDate(startDate, daysBack) {
  return new Promise((resolve, reject) => {
    if (!(startDate instanceof Date)) reject('startDate must be of type Date')
    const someDaysAgo = new Date(startDate.setDate(startDate.getDate() - daysBack))
    const year = someDaysAgo.getFullYear()
    let month = someDaysAgo.getMonth()
    month += 1
    const date = someDaysAgo.getDate()
    const result = `${year}-${month < 10 ? 0 : ''}${month}-${date}`
    resolve(result)
  })
}
