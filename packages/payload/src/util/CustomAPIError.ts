import { APIError } from 'payload'

export class CustomAPIError extends APIError {
  constructor(message: string) {
    super(message, 400, undefined, true)
  }
}
