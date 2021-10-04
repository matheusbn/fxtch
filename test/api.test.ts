import fetchMock from 'jest-fetch-mock'
import fxtch from '../src/index'

// test then with arg combinations
// test catch

describe('API', () => {
  afterEach(() => {
    fetchMock.resetMocks()
  })

  describe('request methods', () => {
    const expectedParams = (method: string) => [
      'https://fake.com/',
      expect.objectContaining({ method }),
    ]

    it('#GET', async () => {
      await fxtch.get('https://fake.com/')

      expect(fetch).toHaveBeenCalledWith(...expectedParams('GET'))
    })
    it('#POST', async () => {
      await fxtch.post('https://fake.com/')

      expect(fetch).toHaveBeenCalledWith(...expectedParams('POST'))
    })
    it('#PATCH', async () => {
      await fxtch.patch('https://fake.com/')

      expect(fetch).toHaveBeenCalledWith(...expectedParams('PATCH'))
    })
    it('#PUT', async () => {
      await fxtch.put('https://fake.com/')

      expect(fetch).toHaveBeenCalledWith(...expectedParams('PUT'))
    })
    it('#HEAD', async () => {
      await fxtch.head('https://fake.com/')

      expect(fetch).toHaveBeenCalledWith(...expectedParams('HEAD'))
    })
    it('#OPTIONS', async () => {
      await fxtch.options('https://fake.com/')

      expect(fetch).toHaveBeenCalledWith(...expectedParams('OPTIONS'))
    })

    it('can be called directly as a GET request', async () => {
      await fxtch('https://fake.com/')

      expect(fetch).toHaveBeenCalledWith(...expectedParams('GET'))
    })
  })

  describe('builder methods', () => {
    it('#query', async () => {
      await fxtch('https://fake.com/').query({ a: 2 })

      expect(fetch).toHaveBeenCalledWith(
        'https://fake.com/?a=2',
        expect.objectContaining({ method: 'GET' })
      )
    })

    it('#send', async () => {
      await fxtch.post('https://fake.com/').send({ a: 2 })

      expect(fetch).toHaveBeenCalledWith(
        'https://fake.com/',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ a: 2 }),
        })
      )
    })
  })
})
