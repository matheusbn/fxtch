import fetchMock from 'jest-fetch-mock'
import fxtch from '../src/index'
import FxtchError from '../src/FxtchError'

describe('API', () => {
  beforeEach(() => expect.hasAssertions())

  afterEach(() => {
    fetchMock.resetMocks()
  })

  describe('thenable', () => {
    test('can receive resolve and reject callbacks', async () => {
      const resolveCallback = jest.fn()
      const rejectCallback = jest.fn()

      await fxtch.get('https://fake.com/').then(resolveCallback, rejectCallback)

      expect(resolveCallback).toHaveBeenCalledTimes(1)
      expect(rejectCallback).not.toHaveBeenCalled()
    })

    test('reject works as second argument', async () => {
      const resolveCallback = jest.fn()
      const rejectCallback = jest.fn()

      fetchMock.mockImplementation(() => Promise.reject())

      await fxtch.get('https://fake.com/').then(resolveCallback, rejectCallback)

      expect(resolveCallback).not.toHaveBeenCalled()
      expect(rejectCallback).toHaveBeenCalledTimes(1)
    })

    test('works with .catch', async () => {
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
      test(`#${method}`, async () => {
        await (fxtch as any)[method]('https://fake.com/')

        expect(fetch).toHaveBeenCalledWith(
          ...expectedParams(method.toUpperCase())
        )
      })
    }

    test('can be called directly as a GET request', async () => {
      await fxtch('https://fake.com/')

      expect(fetch).toHaveBeenCalledWith(...expectedParams('GET'))
    })
  })

  describe('builder methods', () => {
    test('#query can be called multiple times', async () => {
      await fxtch('https://fake.com/').query({ a: 2 }).query({ b: 4 })

      expect(fetch).toHaveBeenCalledWith(
        'https://fake.com/?a=2&b=4',
        expect.objectContaining({ method: 'GET' })
      )
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
      test(`#query can be used with #${method}`, async () => {
        await (fxtch as any)[method]('https://fake.com/').query({ a: 2 })

        expect(fetch).toHaveBeenCalledWith(
          'https://fake.com/?a=2',
          expect.objectContaining({ method: method.toUpperCase() })
        )
      })
    }

    test('#send can be called multiple times', async () => {
      await fxtch.post('https://fake.com/').send({ a: 2 }).send({ b: 4 })

      expect(fetch).toHaveBeenCalledWith(
        'https://fake.com/',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ a: 2, b: 4 }),
        })
      )
    })

    test('#set can be called multiple times', async () => {
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

    test('#set can be called with object as argument', async () => {
      await fxtch
        .post('https://fake.com/')
        .set({ 'API-Key': 'foobar', Authorization: 'blabla' })
        .set('Accept', 'application/json')

      const expectedHeaders = new Headers()

      expectedHeaders.set('API-Key', 'foobar')
      expectedHeaders.set('Accept', 'application/json')
      expectedHeaders.set('Authorization', 'blabla')

      const headers = fetchMock.mock.calls[0][1]?.headers as Headers

      expect([...headers]).toEqual([...expectedHeaders])
    })
  })

  describe('client', () => {
    test('can create client with default configs', async () => {
      const api = fxtch
        .client()
        .baseUrl('https://fake.com/')
        .set({ Authorization: 'blabla' })

      await api.post('/users')
      await api.post('/users')

      const expectedHeaders = new Headers()
      expectedHeaders.set('Authorization', 'blabla')

      const headers = fetchMock.mock.calls[0][1]?.headers as Headers
      const headers2 = fetchMock.mock.calls[1][1]?.headers as Headers

      expect([...headers]).toEqual([...expectedHeaders])
      expect([...headers2]).toEqual([...expectedHeaders])

      expect(fetch).toHaveBeenCalledTimes(2)
      expect(fetch).toHaveBeenCalledWith(
        'https://fake.com/users',
        expect.anything()
      )
    })
  })

  describe('response format', () => {
    test('has expected properties', async () => {
      fetchMock.mockImplementationOnce(() => {
        const res = new Response('{ "a":2 }', {
          headers: { 'Content-Type': 'application/json' },
        })

        // for some reason the Response constructor of the
        // current TS lib doesn't have this property
        Object.defineProperty(res, 'type', {
          value: 'basic',
        })

        return Promise.resolve(res)
      })

      const res = await fxtch.post('https://fake.com/')

      expect(res.raw.constructor.name).toBe('Response')
      expect(res.raw.bodyUsed).toBe(false)

      expect(res.headers.constructor.name).not.toBe('Headers')
      expect(res.status).toBe(200)
      expect(res.redirected).toBe(false)
      expect(res.type).toBe('basic')
      expect(res.statusText).toBe('OK')
      expect(res.statusType).toBe(2)
      expect(typeof res.data).toBe('object')

      Object.keys(res.headers).forEach(key =>
        expect(key).toEqual(expect.not.stringMatching(/[A-Z]/))
      )
    })

    test('rejects with FxtchError on status different then 2xx', async () => {
      expect.assertions(8)

      for (let status of [100, 300, 400, 500]) {
        fetchMock.mockImplementationOnce(() =>
          Promise.resolve(new Response('', { status }))
        )

        await fxtch.post('https://fake.com/').catch(error => {
          expect(error instanceof Error).toBe(true)
          expect((error as FxtchError).response.status).toBe(status)
        })
      }
    })
  })
})
