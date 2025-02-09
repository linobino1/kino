import { Button } from '@payloadcms/ui'
import type { BasePayload } from 'payload'

type Props = {
  payload: BasePayload
}

export const MigrateMovieButton: React.FC<Props> = ({ payload: { config } }) => {
  return (
    <div>
      <a href={`${config.routes.admin}/tmdb-migrate`}>
        <Button>Film aus TMDB migrieren</Button>
      </a>
    </div>
  )
}
