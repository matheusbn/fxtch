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
