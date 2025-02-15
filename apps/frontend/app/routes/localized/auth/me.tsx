import type { Route } from './+types/me'
import type { loader as rootLoader } from '~/root'
import { replace } from 'react-router'
import { Form, useNavigate, useRouteLoaderData } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Link } from '~/components/localized-link'
import { useEffect } from 'react'
import { Button } from '~/components/Button'

// i18n namespace
const ns = 'auth'

/**
 * sign out user
 */
export const action = async ({ request }: Route.ActionArgs) => {
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
        <nav>
          <Link to="/">{t('back')}</Link>
          <Link to="/auth/signin">{t('sign in')}</Link>
        </nav>
      )}
    </>
  )
}
