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
  const params = {
    q: `#${content} since:${date}`,
    lang: 'en',
    result_type: 'recent',
    count: 100,
  }

  let twitterResult
  try {
    twitterResult = await T.get('search/tweets', params)
  } catch (twitterError) {
    throw Error(twitterError)
  }

  const tweets = twitterResult.data.statuses

  if (twitterResult.resp.statusCode === 200 && (Array.isArray(tweets) && tweets.length !== 0)) {
    const randomValue = Math.floor(Math.random() * tweets.length)
    const tweet = tweets[randomValue]

    return {
      text: tweet.text,
      author: tweet.user.screen_name,
      retweets_count: tweet.retweet_count,
      source: tweet.source,
      created_at: tweet.created_at,
    }
  } else if (twitterResult.resp.statusCode === 200) {
    return {}
  } else {
    return null
  }
}
