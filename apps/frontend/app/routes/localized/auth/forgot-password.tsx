import type { Route } from './+types/forgot-password'
import { Form } from 'react-router'
import { useTranslation } from 'react-i18next'
import { getInstance } from '~/middleware/i18next'
import { getPayload } from '~/util/getPayload.server'
import { Label } from '~/components/auth/Label'
import { Input } from '~/components/auth/Input'
import { Button } from '~/components/Button'

export const action = async ({ request, context }: Route.ActionArgs) => {
  const payload = await getPayload()
  const form = await request.formData()
  const { t } = getInstance(context)

  try {
    await payload.forgotPassword({
      collection: 'users',
      data: {
        email: form.get('email') as string,
      },
    })
    return {
      success: true,
      message: t('auth:please check your inbox'),
    }
  } catch {
    return {
      success: false,
      message: t('auth:invalid email address given'),
    }
  }
}

export default function ForgotPassword({ actionData: data }: Route.ComponentProps) {
  const { t } = useTranslation('auth')

  return (
    <>
      <h1 className="mb-8 text-2xl font-semibold">{t('reset your password')}</h1>
      {data && <p>{data.message}</p>}
      {!data?.success && (
        <Form method="POST" className="flex flex-col items-center gap-4">
          {data && 'error' in data && <p>{data.error as string}</p>}
          <Label>
            {t('email')}
            <Input type="email" name="email" />
          </Label>

          <Button type="submit" className="mt-4">
            {t('submit')}
          </Button>
        </Form>
      )}
    </>
  )
}
