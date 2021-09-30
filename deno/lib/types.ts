export interface XResponse {
  status: number
  statusText: string
  headers: Record<string, any>
  data?: any
}

export interface Client {
  get: (url: string, config: Config) => Promise<XResponse>
  delete: (url: string, config?: Config) => Promise<XResponse>
  head: (url: string, config?: Config) => Promise<XResponse>
  options: (url: string, config?: Config) => Promise<XResponse>
  post: (url: string, data?: Data, config?: Config) => Promise<XResponse>
  patch: (url: string, data?: Data, config?: Config) => Promise<XResponse>
  put: (url: string, data?: Data, config?: Config) => Promise<XResponse>
  create: (baseUrl: string) => Client
  baseUrl?: string
}

export interface Config extends RequestInit {
  params?: Record<string, any>
}
export type Data = Record<string, any>
