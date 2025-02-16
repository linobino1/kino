import { configurePayload } from '@app/payload/config'
import { tmdbAxiosClient } from '@app/themoviedb'
import { siteTitle, timezone } from '@app/util/config'

export default configurePayload({
  onInit() {
    try {
      // set themoviedb.org API key from environment variable
      tmdbAxiosClient.defaults.params.api_key = process.env.THEMOVIEDB_API_KEY
    } catch (e) {
      console.error('Error setting themoviedb.org API key:', e)
    }
  },
  admin: {
    timezones: {
      supportedTimezones: [{ label: timezone, value: timezone }],
      defaultTimezone: timezone,
    },
    user: 'users',
    importMap: {
      baseDir: '@/',
    },
    components: {
      beforeDashboard: ['/components/MigrateMovieButton#MigrateMovieButton'],
      graphics: {
        Logo: '/components/graphics/Logo#Logo',
        Icon: '/components/graphics/Icon#Icon',
      },
      views: {
        customView: {
          Component: '/views/TMDBMigration/index#TMDBMigration',
          path: '/tmdb-migrate',
          meta: {
            title: 'Neuen Film anlegen',
          },
        },
      },
    },
    meta: {
      title: siteTitle,
      titleSuffix: ` - ${siteTitle}`,
    },
  },
})
