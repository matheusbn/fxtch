import fetchMock from 'jest-fetch-mock'
import fxtch from '../src/index'

describe('fetch', () => {
  describe('create client', () => {
    it('should update init object method to POST', () => {
      const x = fxtch.create('base.url')

      expect(x.baseUrl).toBe('base.url')
    })
  })
})
