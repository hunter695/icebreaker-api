import { getWildcardFromTwitter } from '../twitter'

it('Should be able to fetch content from Twitter', () => {
  const daysBack = 5
  getWildcardFromTwitter('movies', 1, daysBack, (result) => {
    expect(result.source).toBeTruthy()
  })
})
