import { Form, useActionData } from '@remix-run/react'
import type { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useTranslation } from 'react-i18next'
import i18next from '~/i18next.server'
import { getPayload } from '~/util/getPayload.server'
import Label from '~/components/auth/Label'
import Input from '~/components/auth/Input'
import Button from '~/components/Button'

// i18n namespace
const ns = 'auth'

export const action = async ({ request }: ActionFunctionArgs) => {
  const payload = await getPayload()
  const form = await request.formData()
  const t = await i18next.getFixedT(request, ns)

  try {
    await payload.forgotPassword({
      collection: 'users',
      data: {
        email: form.get('email') as string,
      },
    })
    return json({
      success: true,
      message: t('please check your inbox'),
    })
  } catch {
    return json({
      success: false,
      message: t('invalid email address given'),
    })
  }
}

export default function ForgotPassword() {
  const data = useActionData<typeof action>()
  const { t } = useTranslation(ns)

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