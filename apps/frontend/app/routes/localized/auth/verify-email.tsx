import type { Route } from './+types/verify-email'
import { useTranslation } from 'react-i18next'
import { getInstance } from '~/middleware/i18next'
import { Link } from '~/components/localized-link'
import { getPayload } from '~/util/getPayload.server'

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  const payload = await getPayload()
  const url = new URL(request.url)
  const { t } = getInstance(context)

  try {
    await payload.verifyEmail({
      collection: 'users',
      token: url.searchParams.get('token') ?? '',
    })
  } catch {
    return {
      success: false,
      message: t('auth:your email address could not be verified'),
    }
  }

  return {
    success: true,
    message: t('auth:your email address has been verified!'),
  }
}

export default function VerifyEmail({ loaderData: data }: Route.ComponentProps) {
  const { t } = useTranslation('auth')

  return (
    <>
      <h1>{data.message}</h1>
      {data.success && (
        <nav>
          <Link to="/auth/signin">{t('sign in')}</Link>
        </nav>
      )}
    </>
  )
}
