import type { Locale } from '@app/i18n'
import type { Route } from './+types/newsletter-signup'
import { env } from '@app/util/env/frontend.server'
import { data } from 'react-router'
import { getTFunction } from '~/util/i18n/getTFunction.server'

const validateCaptcha = async (token: string): Promise<boolean> => {
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY!,
        sitekey: env.TURNSTILE_SITE_KEY!,
        response: token,
      }),
    })
    const data = await res.json()
    return !!data.success
  } catch {
    return false
  }
}

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData()

  // validate captcha
  if (!(await validateCaptcha(formData.get('cf-turnstile-response') as string))) {
    return data({
      success: false,
      message: `The humanity checks could not be validated on the server. Sorry, please try again.`,
    })
  }

  const language = formData.get('language') as Locale

  const t = await getTFunction(language)

  const res = await fetch(`${env.LISTMONK_URL}/api/public/subscription`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      email: formData.get('email'),
      name: formData.get('name'),
      list_uuids: [env.LISTMONK_LIST_UUID],
    }),
  })

  if (res.ok) {
    return data({
      success: true,
      message: t('newsletter.success'),
    })
  } else {
    return data({
      success: false,
      // message: `We couldn't sign you up. Please try again.`,
      message: t('newsletter.error.unknown'),
    })
  }
}
