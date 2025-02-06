import { Button } from '@payloadcms/ui'
import { BasePayload } from 'payload'

type Props = {
  payload: BasePayload
}

const MigrateMovieLink: React.FC<Props> = ({ payload: { config } }) => {
  return (
    <div>
      <a href={`${config.routes.admin}/tmdb-migrate`}>
        <Button>Film aus TMDB migrieren</Button>
      </a>
    </div>
  )
}
export default MigrateMovieLink
