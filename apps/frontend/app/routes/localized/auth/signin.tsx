import type { Route } from './+types/signin'
import { Form } from 'react-router'
import { replace } from 'react-router'
import { useTranslation } from 'react-i18next'
import i18next from '~/i18next.server'
import { Link } from '~/components/localized-link'
import { getPayload } from '~/util/getPayload.server'
import Label from '~/components/auth/Label'
import Input from '~/components/auth/Input'
import Button from '~/components/Button'

// i18n namespace
const ns = 'auth'

export const action = async ({ request }: Route.ActionArgs) => {
  const payload = await getPayload()
  const form = await request.formData()
  const t = await i18next.getFixedT(request, ns)

  try {
    const result = await payload.login({
      collection: 'users',
      data: {
        email: form.get('email') as string,
        password: form.get('password') as string,
      },
      overrideAccess: false,
    })

    return replace('/', {
      headers: {
        'Set-Cookie': `payload-token=${result.token}; Path=/; HttpOnly; Max-Age=${result.exp}`,
      },
    })
  } catch {
    return {
      error: t('email and/or password invalid'),
    }
  }
}

export default function SignIn({ actionData }: Route.ComponentProps) {
  const { t } = useTranslation(ns)

  return (
    <>
      <h1 className="text-2xl font-semibold">{t('sign in')}</h1>
      <Form method="POST" className="mt-8 flex flex-col items-center gap-4">
        {actionData?.error && <p className="text-red-500">{actionData?.error}</p>}
        <Label>
          {t('email')}
          <Input type="email" name="email" />
        </Label>

        <Label>
          {t('password')}
          <Input type="password" name="password" />
        </Label>

        <Button type="submit" className="mt-4">
          {t('sign in')}
        </Button>
      </Form>

      <nav className="mt-4 flex flex-col items-center text-sm text-blue-700">
        <Link to="/auth/forgot-password">{t('forgot password?')}</Link>
        <Link to="/auth/signup">{t('sign up')}</Link>
      </nav>
    </>
  )
}
