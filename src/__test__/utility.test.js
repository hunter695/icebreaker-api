import { getPastDate } from '../utility'

it('Should be able to get past date', async () => {
  const date = await getPastDate(10)
  expect(date).toBeTruthy()
})
