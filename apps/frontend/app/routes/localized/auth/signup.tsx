import type { Route } from './+types/signup'
import { Form } from 'react-router'
import { useTranslation } from 'react-i18next'
import i18next from '~/i18next.server'
import { getPayload } from '~/util/getPayload.server'
import { Label } from '~/components/auth/Label'
import { Input } from '~/components/auth/Input'
import { Button } from '~/components/Button'

// i18n namespace
const ns = 'auth'
export const handle = { i18n: 'auth' }

export const action = async ({ request }: Route.ActionArgs) => {
  const payload = await getPayload()
  const t = await i18next.getFixedT(request, ns)

  return {
    success: false,
    message: t('Registration is disabled!'),
  }

  const form = await request.formData()

  // create user
  try {
    await payload.create({
      collection: 'users',
      data: {
        email: form.get('email') as string,
        name: form.get('name') as string,
        password: form.get('password') as string,
      },
      overrideAccess: false,
    })
  } catch {
    return Response.json({
      success: false,
      message: t('could not create account, maybe you are already registered?'),
    })
  }

  return Response.json({
    success: true,
    message: t('your account has been created, please check your inbox now'),
  })
}

export default function SignUp({ actionData: data }: Route.ComponentProps) {
  const { t } = useTranslation(ns)

  return (
    <>
      <h1 className="text-2xl font-semibold">{t('sign up')}</h1>
      {data?.message && <p>{data.message}</p>}
      {!data?.success && (
        <Form method="POST" className="mt-8 flex flex-col items-center gap-4">
          <Label>
            {t('name')}
            <Input type="name" name="name" />
          </Label>

          <Label>
            {t('email')}
            <Input type="email" name="email" />
          </Label>

          <Label>
            {t('password')}
            <Input type="password" name="password" />
          </Label>

          <Button type="submit" className="mt-4">
            {t('sign up')}
          </Button>
        </Form>
      )}
    </>
  )
}
