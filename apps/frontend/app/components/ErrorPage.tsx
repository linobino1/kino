import React from 'react'
import { useRouteError, isRouteErrorResponse } from 'react-router'
import { useEnv } from '~/util/useEnv'
import PageLayout from './PageLayout'
import { useTranslation } from 'react-i18next'
import Gutter from './Gutter'
import Hero from './Hero'

export const ErrorPage: React.FC = () => {
  const error = useRouteError()
  const env = useEnv()
  const { t } = useTranslation()

  return (
    <PageLayout type={'info'}>
      <Gutter className="text-center">
        <Hero type="headline" headline={t('Error')} />
        {isRouteErrorResponse(error) ? (
          <p
            dangerouslySetInnerHTML={{
              __html: `${error.status} - ${error.data}`,
            }}
          />
        ) : error instanceof Error ? (
          <>
            <p dangerouslySetInnerHTML={{ __html: error.message }} />

            {env?.NODE_ENV === 'development' && (
              <div className="mt-8 text-left">
                <h2 className="mt-4 font-bold">this will only show in development:</h2>
                <hr className="my-2" />
                <pre className="w-full text-xs">{error.stack}</pre>
              </div>
            )}
          </>
        ) : (
          <p>{t('error.unkown')}</p>
        )}
      </Gutter>
    </PageLayout>
  )
}

export default ErrorPage
