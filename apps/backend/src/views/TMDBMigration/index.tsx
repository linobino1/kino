import type { AdminViewProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { MigrateMovieComponent } from './Component.client'
import { redirect } from 'next/navigation'

export const TMDBMigration: React.FC<AdminViewProps> = ({
  initPageResult,
  params,
  searchParams,
}) => {
  const { user } = initPageResult.req
  if (!user) return redirect('/admin')
  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={user}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter>
        <h1>Neuen Film anlegen</h1>
        <MigrateMovieComponent />
      </Gutter>
    </DefaultTemplate>
  )
}
