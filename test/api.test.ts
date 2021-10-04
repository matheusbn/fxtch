import fetchMock from 'jest-fetch-mock'
import fxtch from '../src/index'

// test then with arg combinations
// test catch

describe('API', () => {
  afterEach(() => {
    fetchMock.resetMocks()
  })

  describe('thenable', () => {
    it('can receive resolve and reject callbacks', async () => {
      const resolveCallback = jest.fn()
      const rejectCallback = jest.fn()

      await fxtch.get('https://fake.com/').then(resolveCallback, rejectCallback)

      expect(resolveCallback).toHaveBeenCalledTimes(1)
      expect(rejectCallback).not.toHaveBeenCalled()
    })

    it('reject works as second argument', async () => {
      const resolveCallback = jest.fn()
      const rejectCallback = jest.fn()

      fetchMock.mockImplementation(() => Promise.reject())

      await fxtch.get('https://fake.com/').then(resolveCallback, rejectCallback)

      expect(resolveCallback).not.toHaveBeenCalled()
      expect(rejectCallback).toHaveBeenCalledTimes(1)
    })

    it('works with .catch', async () => {
      const rejectCallback = jest.fn()

      fetchMock.mockImplementation(() => Promise.reject())

      await fxtch.get('https://fake.com/').catch(rejectCallback)

      expect(rejectCallback).toHaveBeenCalledTimes(1)
    })
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
