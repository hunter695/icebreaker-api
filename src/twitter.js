// const express = require('express')
import config from './config' // for twitter API and MongoDB URL
import { getPastDate } from './utility'

const twit = require('twit') // module for interacting with Twitter API

const T = twit(config.twitter)

module.exports = {
  /**
   * passes acquired wildcard tweet to callback
   * @param {string} content a string such as 'pickupline(s)' or 'icebreaker(s)'
   * @param {number} amount how many tweets you want back.
   * @param {string} daysBack how far back in time to get tweets
   * @param {requestCallback} callback runs after successful Twitter API call,
   * with an object containing information from tweet passed to it.
   */
  async getWildcardFromTwitter(content, amount, daysBack, callback) {
    let tweet
    let result
    let date
    try {
      date = await getPastDate(daysBack)
    } catch (getErr) {
      throw Error(getErr)
    }
    // console.log(date)
    const params = {
      q: `#${content} since:${date}`,
      lang: 'en',
      result_type: 'recent',
      count: amount,
    }
    T.get('search/tweets', params, (twitterError, data, response) => {
      tweet = data.statuses
      if (response.statusCode !== 200 || (Array.isArray(tweet) && tweet.length === 0)) {
        callback(null)
      } else {
        result = {
          text: tweet[0].text,
          author: tweet[0].user.screen_name,
          retweet_count: tweet[0].retweet_count,
          source: tweet[0].source,
          created_at: tweet[0].created_at,
        }
        callback(result)
      }
    })
  },
}
