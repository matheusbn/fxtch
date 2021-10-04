export interface FxetchResponse {
  status: number
  statusText: string
  headers: Record<string, any>
  data?: any
}

export interface Client {
  get: (url: string, config: Config) => Promise<FxetchResponse>
  delete: (url: string, config?: Config) => Promise<FxetchResponse>
  head: (url: string, config?: Config) => Promise<FxetchResponse>
  options: (url: string, config?: Config) => Promise<FxetchResponse>
  post: (url: string, data?: Data, config?: Config) => Promise<FxetchResponse>
  patch: (url: string, data?: Data, config?: Config) => Promise<FxetchResponse>
  put: (url: string, data?: Data, config?: Config) => Promise<FxetchResponse>
  create: (baseUrl: string) => Client
  baseUrl?: string
}

export interface Config extends RequestInit {
  params?: Record<string, any>
}

export type Data = Record<string, any>
