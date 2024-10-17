import { parse } from 'cookie-es'
import type { PayloadRequest } from 'payload'

export const extractTokenFromRequest = (request: PayloadRequest) => {
  const cookie = parse(request.headers.get('cookie') || '')
  return cookie['payload-token']
}
