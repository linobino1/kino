import { redirect } from 'react-router'

/**
 * sign out user by deleting the payload token cookie
 */
export const action = async () => {
  return redirect('/', {
    headers: {
      'Set-Cookie': 'payload-token=; Path=/; HttpOnly; SameSite=Lax',
    },
  })
}
