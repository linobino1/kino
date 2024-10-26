import { Form, useActionData } from '@remix-run/react'
import type { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useTranslation } from 'react-i18next'
import { classes } from '~/classes'
import i18next from '~/i18next.server'
import { getPayload } from '~/util/getPayload.server'

// i18n namespace
const ns = 'auth'
export const handle = { i18n: 'auth' }

export const action = async ({ request }: ActionFunctionArgs) => {
  const payload = await getPayload()
  const t = await i18next.getFixedT(request, ns)

  return json({
    success: false,
    message: t('Registration is disabled!'),
  })

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
    return json({
      success: false,
      message: t('could not create account, maybe you are already registered?'),
    })
  }

  return json({
    success: true,
    message: t('your account has been created, please check your inbox now'),
  })
}

export default function SignUp() {
  const data = useActionData<typeof action>()
  const { t } = useTranslation(ns)

  return (
    <>
      <h1>{t('sign up')}</h1>
      {data?.message && <p>{data.message}</p>}
      {!data?.success && (
        <Form method="POST" className={classes.form}>
          <label>
            {t('name')}
            <input type="name" name="name" />
          </label>

          <label>
            {t('email')}
            <input type="email" name="email" />
          </label>

          <label>
            {t('password')}
            <input type="password" name="password" />
          </label>

          <button type="submit">{t('sign up')}</button>
        </Form>
      )}
    </>
  )
}
