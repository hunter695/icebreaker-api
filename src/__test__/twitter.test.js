import { getTweet } from '../twitter'

it('Should be able to fetch content from Twitter', async () => {
  const daysBack = 10

  // get message from Twitter with #helloworld
  let result = await getTweet('helloworld', daysBack)
  expect(result).toBeTruthy()
})
