import { getPastDate } from '../utility'

describe('Getting previous dates', () => {

  it('Should be able to get the correct date from the previous month', async () => {
    const startDate = new Date('May 1, 2017')
    const date = await getPastDate(startDate, 10)
    expect(date).toEqual('2017-04-21')
  })

  it('Should fail when giving milliseconds as startDate', async () => {
    const startDate = 1494188148512
    await expect(getPastDate(startDate, 10)).rejects.toMatch('startDate must be of type Date')
  })
})
