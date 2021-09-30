import { parseResponse } from './utils.ts'
import { XResponse, Client, Config, Data } from './types.ts'

// accept query params argument [x]
// accept post data arg [x]
// define response format [x]
// return errors with catch? [x]
// create client [x]
// impelment other methods [x]
// parse body options
// blob
// stream
// formData
// text
// look into config options
// test

const createClient = (): Client => {
  // const info: RequestInfo
  const init: RequestInit & { headers: Headers } = {
    method: 'GET',
    headers: new Headers(),
  }

  let baseUrl = ''

  const request = (
    url: string | URL,
    config: Config = {},
    method: string = 'GET'
  ) => {
    init.method = method

    const input = url instanceof URL ? url : baseUrl + url
    return fetch(input, init).then(parseResponse)
  }

  const createMethod =
    (method: string) =>
    (url: string, config: Config = {}) =>
      request(url, config, method)

  const createMutationMethod = (method: string) => {
    return (url: string, data?: Data, config: Config = {}) => {
      if (data) {
        init.body = JSON.stringify(data)
        init.headers.append('Content-Type', 'application/json')
      }

      return request(url, config, method)
    }
  }

  const post = createMutationMethod('POST')
  const patch = createMutationMethod('PATCH')
  const put = createMutationMethod('PUT')

  const del = createMethod('DELETE')
  const head = createMethod('HEAD')
  const options = createMethod('OPTIONS')

  const get = (url: string, config: Config = {}) => {
    const urlObj = new URL(baseUrl + url)

    if (config.params)
      urlObj.search = new URLSearchParams(config.params).toString()

    return request(urlObj)
  }

  function create(this: Client, base: string) {
    baseUrl = base
    return this
  }

  return {
    get,
    post,
    patch,
    put,
    delete: del,
    head,
    options,
    create,
  }
}

const x = createClient()

export default x
