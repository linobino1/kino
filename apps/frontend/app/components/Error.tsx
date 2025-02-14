import React from 'react'
import { isRouteErrorResponse } from 'react-router'
import { useEnv } from '~/util/useEnv'
import { useTranslation } from 'react-i18next'
import { Gutter } from './Gutter'
import { Hero } from './Hero'

type Props = {
  error: any
}

export const ErrorComponent: React.FC<Props> = ({ error }) => {
  const env = useEnv()
  const { t } = useTranslation()

  return (
    <Gutter className="min-h-screen pt-16 text-center">
      <Hero type="headline" headline={t('Error')} />
      {isRouteErrorResponse(error) ? (
        <p>{`${error.status} - ${error.data}`}</p>
      ) : error instanceof Error ? (
        <>
          <p>{error.message}</p>

          {env?.NODE_ENV === 'development' && (
            <div className="mt-8 text-left">
              <h2 className="mt-4 font-bold">dev only stacktrace:</h2>
              <hr className="my-2" />
              <pre className="w-full overflow-x-auto bg-white p-2 text-xs text-black">
                {error.stack}
              </pre>
            </div>
          )}
        </>
      ) : (
        <p>{t('error.unkown')}</p>
      )}
    </Gutter>
  )
}
