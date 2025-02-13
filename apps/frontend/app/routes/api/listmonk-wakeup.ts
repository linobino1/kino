import { env } from '@app/util/env/frontend.server'

export const action = async () => {
  // wake listmonk up, otherwise the first request will fail
  const wakeUpResponse = await fetch(`${env.LISTMONK_URL}`, {
    method: 'get',
  })
  if (!wakeUpResponse.ok) {
    return Response.json({
      success: false,
      message: 'the newsletter server has a problem',
    })
  }
  return Response.json({
    success: true,
    message: 'Listmonk is waking up',
  })
}
