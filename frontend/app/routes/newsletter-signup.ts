import { json, type ActionFunction } from '@remix-run/node'
import { env } from '~/env.server'
import i18next from '~/i18next.server'

const validateCaptcha = async (token: string): Promise<boolean> => {
  // TODO
  console.log('validateCaptcha', token)
  console.log('TURNSTILE_SITE_KEY', env.TURNSTILE_SITE_KEY)
  console.log('skip captcha validation')
  return true
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY,
        sitekey: env.TURNSTILE_SITE_KEY,
        response: token,
      }),
    })
    const data = await res.json()
    console.log('validateCaptcha data', data)
    return !!data.success
  } catch (err) {
    console.error('validateCaptcha error', err)
    return false
  }
}

export const action: ActionFunction = async ({ request }) => {
  const t = await i18next.getFixedT(request)
  const data = await request.formData()
  console.log('formdata', data)
  console.log('listmonk', env.LISTMONK_URL, env.LISTMONK_LIST_ID)

  // validate captcha
  if (!(await validateCaptcha(data.get('cf-turnstile-response') as string))) {
    return json({
      success: false,
      message: `The humanity checks could not be validated on the server. Sorry, please try again.`,
    })
  }

  const res = await fetch(`${env.LISTMONK_URL}/api/public/subscription`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      email: data.get('email'),
      name: data.get('name'),
      list_uuids: [env.LISTMONK_LIST_ID],
    }),
  })

  if (res.ok) {
    return {
      success: true,
      message: t('newsletter.success'),
      original_response: res.json(),
    }
  } else {
    return {
      success: false,
      // message: `We couldn't sign you up. Please try again.`,
      message: t('newsletter.error.unknown'),
      original_response: res.json(),
    }
  }
}
