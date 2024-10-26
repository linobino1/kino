import { Button } from '@payloadcms/ui'

// how to type a custom server component?
const MigrateMovieLink: React.FC<any> = ({ payload: { config } }) => {
  return (
    <div>
      <a href={`${config.routes.admin}/tmdb-migrate`}>
        <Button>Neuen Film anlegen</Button>
      </a>
    </div>
  )
}
export default MigrateMovieLink
