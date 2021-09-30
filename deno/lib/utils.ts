import { FxetchResponse, Client, Config, Data } from './types.ts'

function pick<T extends object, U extends keyof T>(
  object: T,
  props: Array<U>
): Pick<T, U> {
  return props.reduce((acc, k) => ({ ...acc, [k]: object[k] }), {}) as Pick<
    T,
    U
  >
}

const parseBody = async (res: Response) => {
  const contentType = res.headers.get('content-type')

  if (contentType?.includes('application/json')) {
    return res.json()
  }

  return res
}

export const parseResponse = async (res: Response): Promise<FxetchResponse> => {
  const parsed = {
    // rawRasponse: res,
    ...pick(res, ['status', 'statusText']),
    headers: Object.fromEntries(res.headers.entries()),
    data: await parseBody(res),
  }

  if (res.ok) return parsed

  return Promise.reject({
    response: parsed,
  })
}
