export default class FxtchError extends Error {
  constructor(public response: Response) {
    super()
  }
}
