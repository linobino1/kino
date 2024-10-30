import { type ActionFunctionArgs, type ActionFunction, replace } from '@remix-run/cloudflare'
import { Form, useActionData, useNavigate, useRouteLoaderData } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import { classes } from '~/classes'
import { Link } from '~/components/localized-link'
import { loader as rootLoader } from '~/root'
import { useEffect } from 'react'
import { Button } from '~/components/Button'

// i18n namespace
const ns = 'auth'

/**
 * sign out user
 */
export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData()

  switch (form.get('_action')) {
    case 'signOut':
      return replace('/', {
        headers: {
          'Set-Cookie': `payload-token=; Path=/; HttpOnly; Max-Age=0`,
        },
      })
  }
}

export default function Me() {
  const rootLoaderData = useRouteLoaderData<typeof rootLoader>('root')
  const actionData = useActionData<typeof action>()
  const navigate = useNavigate()
  const { t } = useTranslation(ns)
  const user = rootLoaderData?.user

  useEffect(() => {
    if (!user) {
      navigate('/auth/signin', { replace: true })
    }
  }, [user])

  return (
    <>
      {actionData?.message && <p>{actionData.message as string}</p>}
      {user ? (
        <>
          {t('Signed in as {{user}}', { user: user.name })}
          <Form method="POST" className="flex flex-col items-center gap-4">
            <input type="hidden" name="id" value={user.id} />
            <Button type="submit" name="_action" value="signOut">
              {t('sign out')}
            </Button>
          </Form>
        </>
      ) : (
        <nav className={classes.nav}>
          <Link to="/">{t('back')}</Link>
          <Link to="/auth/signin">{t('sign in')}</Link>
        </nav>
      )}
    </>
  )
}
