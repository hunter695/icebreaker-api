import { getTweet } from '../twitter'
import config from '../config' // for twitter API and MongoDB URL

const twit = require('twit') // module for interacting with Twitter API
const T = twit(config.twitter)

it('Should be able to fetch content from Twitter', async () => {
  const daysBack = 10
  let idString
  const time = new Date().getTime()
  // tweet a message to make sure there is a tweet with #helloworld recently.
  await T.post('statuses/update', { status: `#helloworld Twitter API Jest test ${time}` }, (err, data) => {
    idString = data.id_str
  })
  // get message from Twitter with #helloworld
  let result = await getTweet('helloworld', daysBack);
  ['text', 'author', 'retweets_count', 'source', 'created_at'].forEach((key) => {
    expect(key in result).toEqual(true)
  })
  // delete the message
  if (idString){
    await T.post('statuses/destroy/:id', { id: idString })
  }
})
