import { getTweet } from '../twitter'
import config from '../config' // for twitter API and MongoDB URL

const twit = require('twit') // module for interacting with Twitter API
const T = twit(config.twitter)

it('Should be able to fetch content from Twitter', async () => {
  const daysBack = 1
  let idString
  // tweet a message to make sure there is a tweet with #helloworld recently.
  await T.post('statuses/update', { status: '#helloworld Twitter API Jest test' }, (err, data) => {
    idString = data.id_str
  })
  // get message from Twitter with #helloworld
  let result = await getTweet('helloworld', daysBack)
  expect(result).toBeTruthy()
  // delete the message
  await T.post('statuses/destroy/:id', { id: idString })
})
