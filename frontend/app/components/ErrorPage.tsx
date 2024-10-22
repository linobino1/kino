import React from 'react'
import { useRouteError, isRouteErrorResponse } from '@remix-run/react'
import { captureRemixErrorBoundaryError, captureException } from '@sentry/remix'
import { Page } from './Page'
import { useEnv } from '~/util/useEnv'

export const ErrorPage: React.FC = () => {
  const error = useRouteError()
  const env = useEnv()
  let children = null

  captureRemixErrorBoundaryError(error)

  if (!isRouteErrorResponse(error) || (isRouteErrorResponse(error) && error.status >= 500)) {
    console.log('captured error with sentry')
    captureException(error)
    // console.error(error);
  }

  if (isRouteErrorResponse(error)) {
    children = (
      <h1>
        {error.status} {error.data}
      </h1>
    )
  } else if (error instanceof Error) {
    children = (
      <>
        <h1>Error</h1>
        <p>{error.message}</p>
        {env?.NODE_ENV === 'development' && <pre>{error.stack}</pre>}
      </>
    )
  } else {
    children = <h1>Unknown Error</h1>
  }
  return (
    <Page
      layout={{
        blocks: [
          {
            blockType: 'outlet',
          },
        ],
        type: 'default',
      }}
    >
      {children}
    </Page>
  )
}

export default ErrorPage
