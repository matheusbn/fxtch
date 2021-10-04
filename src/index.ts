import { parseResponse } from './utils'
import { FxetchResponse, Config, Data } from './types'

// https://stackoverflow.com/questions/29435262/regarding-promises-a-specification-what-is-the-difference-between-the-terms-t

class Client {
  // const a: RequestInfo
  init: RequestInit & { headers: Headers } = {
    method: 'GET',
    headers: new Headers(),
  }
  url: string | URL = ''
  params: Data
  data: Data

  query(params: Data) {
    this.params = { ...this.params, ...params }

    return this
  }

  send(data: Data) {
    this.data = { ...this.data, ...data }

    return this
  }

  // set
  // use?

  then(
    onResolve?: (response: FxetchResponse) => any,
    onReject?: (response: FxetchResponse) => any
  ) {
    const url = new URL(this.url)
    url.search = new URLSearchParams(this.params).toString()

    if (this.data) {
      this.init.body = JSON.stringify(this.data)
      this.init.headers.append('Content-Type', 'application/json')
    }

    return fetch(url.toString(), this.init)
      .then(parseResponse)
      .then(onResolve, onReject)
  }
}

function request(url: string | URL) {
  const x = new Client()

  x.url = url

  return x
}

function createMethod(method: string) {
  return (url: string | URL) => {
    const x = request(url)

    x.init.method = method

    return x
  }
}

request.get = request
request.post = createMethod('POST')
request.patch = createMethod('PATCH')
request.put = createMethod('PUT')
request.del = createMethod('DELETE')
request.head = createMethod('HEAD')
request.options = createMethod('OPTIONS')

export default request
