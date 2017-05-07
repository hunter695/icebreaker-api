import { getTweet } from '../twitter'

it('Should be able to fetch content from Twitter', async () => {
  const daysBack = 10

  // get message from Twitter with #helloworld
  let result = await getTweet('helloworld', daysBack);
  ['text', 'author', 'retweets_count', 'source', 'created_at'].forEach((key) => {
    expect(key in result).toEqual(true)
  })
})
