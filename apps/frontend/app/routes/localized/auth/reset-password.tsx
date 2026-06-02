import type { Route } from './+types/reset-password'
import { Form } from 'react-router'
import { useTranslation } from 'react-i18next'
import { getInstance } from '~/middleware/i18next'
import { Link } from '~/components/localized-link'
import { getPayload } from '~/util/getPayload.server'
import { Label } from '~/components/auth/Label'
import { Input } from '~/components/auth/Input'
import { Button } from '~/components/Button'

export const action = async ({ request, context }: Route.ActionArgs) => {
  const payload = await getPayload()
  const url = new URL(request.url)
  const form = await request.formData()
  const { t } = getInstance(context)

  try {
    await payload.resetPassword({
      collection: 'users',
      overrideAccess: false,
      data: {
        password: form.get('password') as string,
        token: url.searchParams.get('token') ?? '',
      },
    })
  } catch {
    return {
      success: false,
      message: t('auth:either your password reset token or the new password is invalid'),
    }
  }

  return {
    success: true,
    message: t('auth:your new password has been saved!'),
  }
}

export default function VerifyEmail({ actionData: data }: Route.ComponentProps) {
  const { t } = useTranslation('auth')

  return (
    <>
      <h1 className="mb-8 text-2xl font-semibold">{t('reset your password')}</h1>
      {data?.message && <p>{data.message}</p>}
      {data?.success ? (
        <nav>
          <Link to="/auth/signin">{t('sign in')}</Link>
        </nav>
      ) : (
        <Form method="POST" className="flex flex-col items-center gap-4">
          <Label>
            {t('your new password')}
            <Input type="password" name="password" />
          </Label>

          <Button type="submit">{t('submit')}</Button>
        </Form>
      )}
    </>
  )
}
