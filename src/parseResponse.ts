import FxtchError from 'FxtchError'
import { FxtchResponse, StatusType } from './types'

const parseBody = (res: Response) => {
  const contentType = res.headers.get('content-type')

  if (contentType?.includes('application/json')) {
    return res.clone().json()
  }

  return res.clone().text()
}

export const parseResponse = async (res: Response): Promise<FxtchResponse> => {
  const parsed: FxtchResponse = {
    raw: res,
    redirected: res.redirected,
    status: res.status,
    statusText: res.statusText,
    statusType: Math.trunc(res.status / 100) as StatusType,
    type: res.type,
    headers: Object.fromEntries(res.headers.entries()),
  }

  const data = await parseBody(res)
  if (data) parsed.data = data

  if (res.ok) return parsed

  throw new FxtchError(res)
}
