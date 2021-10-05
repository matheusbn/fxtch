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

    for (let method of [
      'get',
      'post',
      'patch',
      'put',
      'delete',
      'head',
      'options',
    ]) {
      it(`#${method}`, async () => {
        await (fxtch as any)[method]('https://fake.com/')

        expect(fetch).toHaveBeenCalledWith(
          ...expectedParams(method.toUpperCase())
        )
      })
    }

    it('can be called directly as a GET request', async () => {
      await fxtch('https://fake.com/')

      expect(fetch).toHaveBeenCalledWith(...expectedParams('GET'))
    })
  })

  describe('builder methods', () => {
    it('#query can be called multiple times', async () => {
      await fxtch('https://fake.com/').query({ a: 2 }).query({ b: 4 })

      expect(fetch).toHaveBeenCalledWith(
        'https://fake.com/?a=2&b=4',
        expect.objectContaining({ method: 'GET' })
      )
    })

    it('#send can be called multiple times', async () => {
      await fxtch.post('https://fake.com/').send({ a: 2 }).send({ b: 4 })

      expect(fetch).toHaveBeenCalledWith(
        'https://fake.com/',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ a: 2, b: 4 }),
        })
      )
    })

    it('#set can be called multiple times', async () => {
      await fxtch
        .post('https://fake.com/')
        .set('API-Key', 'foobar')
        .set('Accept', 'application/json')

      const expectedHeaders = new Headers()

      expectedHeaders.set('API-Key', 'foobar')
      expectedHeaders.set('Accept', 'application/json')

      const headers = fetchMock.mock.calls[0][1]?.headers as Headers

      expect([...headers]).toEqual([...expectedHeaders])
    })

    for (let method of [
      'get',
      'post',
      'patch',
      'put',
      'delete',
      'head',
      'options',
    ]) {
      it(`#query can be used with #${method}`, async () => {
        await (fxtch as any)[method]('https://fake.com/').query({ a: 2 })

        expect(fetch).toHaveBeenCalledWith(
          'https://fake.com/?a=2',
          expect.objectContaining({ method: method.toUpperCase() })
        )
      })
    }
  })
})
