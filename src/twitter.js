// const express = require('express')
import config from './config' // for twitter API and MongoDB URL
import { getPastDate } from './utility'

const twit = require('twit') // module for interacting with Twitter API

const T = twit(config.twitter)

/**
 * Passes acquired wildcard tweet to callback
 * @param {string} content a string such as 'pickupline(s)' or 'icebreaker(s)'
 * @param {number} amount how many tweets you want back.
 * @param {string} daysBack how far back in time to get tweets
 * with an object containing information from tweet passed to it. If the
 * retrieval fails, the null is passed to callback().
 */
export async function getWildcardFromTwitter(content, daysBack) {
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
    count: 1,
  }
  let twitterResult
  try {
    twitterResult = await T.get('search/tweets', params)
  } catch (twitterError) {
    throw Error(twitterError)
  }
  let result
  const tweet = twitterResult.data.statuses
  if (twitterResult.resp.statusCode === 200 || (Array.isArray(tweet) && tweet.length !== 0)) {
    result = {
      text: tweet[0].text,
      author: tweet[0].user.screen_name,
      retweet_count: tweet[0].retweet_count,
      source: tweet[0].source,
      created_at: tweet[0].created_at,
    }
  }
  return result
}
