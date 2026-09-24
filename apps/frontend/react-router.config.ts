import type { Config } from '@react-router/dev/config'

export default {
  ssr: true,
  allowedActionOrigins: [
    'kinoimblauensalon.de',
    '*.kinoimblauensalon.de',
    '127.0.0.1',
    'localhost',
    '*.local',
  ],
} satisfies Config
