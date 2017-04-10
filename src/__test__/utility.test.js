import { getPastDate } from '../utility'

it('Should be able to fetch content from Twitter', async () => {
  const date = await getPastDate(10)
  expect(date).toBeTruthy()
})
