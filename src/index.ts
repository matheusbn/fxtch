import { parseResponse } from './utils'
import { FxetchResponse, Config, Data } from './types'
import FxtchError from 'FxtchError'

class Client {
  init: RequestInit & { headers: Headers } = {
    method: 'GET',
    headers: new Headers(),
  }

  urlBase: string
  url: string | URL | null
  params: Data
  data: Data

  baseUrl(urlBase: string) {
    this.urlBase = urlBase

    return this
  }

  query(params: Data) {
    this.params = { ...this.params, ...params }

    return this
  }

  send(data: Data) {
    this.data = { ...this.data, ...data }

    return this
  }

  set(params: Record<string, string>): Client
  set(name: string, value: string): Client
  set(nameOrParams: string | Record<string, string>, value?: string) {
    if (typeof nameOrParams === 'object') {
      Object.entries(nameOrParams).forEach(([k, v]) =>
        this.init.headers.set(k, v)
      )
    } else if (!value) {
      throw new Error(`Missing value for header ${nameOrParams}`)
    } else {
      this.init.headers.set(nameOrParams, value)
    }

    return this
  }

  then(
    onResolve?: (response: FxetchResponse) => any,
    onReject?: (response: FxtchError | TypeError) => any
  ) {
    if (!this.url) throw new Error('URL has not been set')

    const url = new URL(this.url, this.urlBase)
    this.url = null
    url.search = new URLSearchParams(this.params).toString()

    if (this.data) {
      this.init.body = JSON.stringify(this.data)
      this.init.headers.append('Content-Type', 'application/json')
    }

    const input: RequestInfo = url.toString()
    return fetch(input, this.init).then(parseResponse).then(onResolve, onReject)
  }

  catch(onReject?: (response: FxtchError | TypeError) => any) {
    return this.then(undefined, onReject)
  }

  private createRequestMethod(method: string) {
    return function (this: Client, url: string | URL) {
      if (this.url) throw new Error('URL cannot be set twice')

      this.init.method = method
      this.url = url

      return this
    }
  }

  get = this.createRequestMethod('GET')
  post = this.createRequestMethod('POST')
  patch = this.createRequestMethod('PATCH')
  put = this.createRequestMethod('PUT')
  delete = this.createRequestMethod('DELETE')
  head = this.createRequestMethod('HEAD')
  options = this.createRequestMethod('OPTIONS')
}

const request = function request(url: string | URL) {
  const x = new Client()

  x.url = url

  return x
}

function createRequestMethod(method: string) {
  return (url: string | URL) => {
    const x = request(url)

    x.init.method = method

    return x
  }
}

request.get = request
request.post = createRequestMethod('POST')
request.patch = createRequestMethod('PATCH')
request.put = createRequestMethod('PUT')
request.delete = createRequestMethod('DELETE')
request.head = createRequestMethod('HEAD')
request.options = createRequestMethod('OPTIONS')
request.client = function client() {
  return new Client()
}

export default request
