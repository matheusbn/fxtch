import FxtchError from 'FxtchError'
import { FxtchResponse, StatusType } from './types'

// function pick<T extends object, U extends keyof T>(
//   object: T,
//   props: Array<U>
// ): Pick<T, U> {
//   return props.reduce((acc, k) => ({ ...acc, [k]: object[k] }), {}) as Pick<
//     T,
//     U
//   >
// }

const parseBody = async (res: Response): Promise<any | undefined> => {
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
