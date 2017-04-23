// const express = require('express')
import config from './config' // for twitter API and MongoDB URL
import { getPastDate } from './utility'

const twit = require('twit') // module for interacting with Twitter API

const T = twit(config.twitter)

/**
 * Returns tweet details with hashtage of content param.
 * @param {string} content a string such as 'pickupline(s)' or 'icebreaker(s)'
 * @param {string} daysBack how far back in time to get tweets
 * @return {object} object containing tweet information.
 */
export async function getTweet(content, daysBack) {
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
  const tweet = twitterResult.data.statuses
  if (twitterResult.resp.statusCode === 200 && (Array.isArray(tweet) && tweet.length !== 0)) {
    return {
      text: tweet[0].text,
      author: tweet[0].user.screen_name,
      retweet_count: tweet[0].retweet_count,
      source: tweet[0].source,
      created_at: tweet[0].created_at,
    }
  } else if (twitterResult.resp.statusCode === 200) {
    return {}
  } else {
    return null
  }
}
