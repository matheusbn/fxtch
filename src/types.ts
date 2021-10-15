export type StatusType = 1 | 2 | 3 | 4 | 5

export interface FxtchResponse {
  raw: Response
  status: number
  statusText: string
  redirected: boolean
  type: ResponseType
  headers: Record<string, string>
  data?: any
  statusType: StatusType
}

export interface Client {
  get: (url: string, config: Config) => Promise<FxtchResponse>
  delete: (url: string, config?: Config) => Promise<FxtchResponse>
  head: (url: string, config?: Config) => Promise<FxtchResponse>
  options: (url: string, config?: Config) => Promise<FxtchResponse>
  post: (url: string, data?: Data, config?: Config) => Promise<FxtchResponse>
  patch: (url: string, data?: Data, config?: Config) => Promise<FxtchResponse>
  put: (url: string, data?: Data, config?: Config) => Promise<FxtchResponse>
  create: (baseUrl: string) => Client
  baseUrl?: string
}

export interface Config extends RequestInit {
  params?: Record<string, any>
}

export type Data = Record<string, any>
