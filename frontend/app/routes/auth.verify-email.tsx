import type { LoaderFunctionArgs } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import { classes } from '~/classes'
import i18next from '~/i18next.server'
import { Link } from '~/components/localized-link'
import { getPayload } from '~/util/getPayload.server'

// i18n namespace
const ns = 'auth'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const payload = await getPayload()
  const url = new URL(request.url)
  const t = await i18next.getFixedT(request, ns)

  try {
    await payload.verifyEmail({
      collection: 'users',
      token: url.searchParams.get('token') ?? '',
    })
  } catch {
    return json({
      success: false,
      message: t('your email address could not be verified'),
    })
  }

  return json({
    success: true,
    message: t('your email address has been verified!'),
  })
}

export default function VerifyEmail() {
  const data = useLoaderData<typeof loader>()
  const { t } = useTranslation(ns)

  return (
    <>
      <h1>{data.message}</h1>
      {data.success && (
        <nav className={classes.nav}>
          <Link to="/auth/signin">{t('sign in')}</Link>
        </nav>
      )}
    </>
  )
}
