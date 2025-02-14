import type { Route } from './+types/kronolith-iframe'

export const loader = async ({ request }: Route.LoaderArgs) => {
  const token = new URL(request.url).searchParams.get('token')
  const calendar = new URL(request.url).searchParams.get('calendar')

  if (!token || !calendar) {
    throw new Response('token and/or calendar parameter missing', { status: 400 })
  }

  const url = `https://webmail.hfg-karlsruhe.de/services/ajax.php/kronolith/embed?token=${token}&calendar=${calendar}&view=Monthlist&container=kronolithCal`

  const html = `
  <html>
    <head>
      <script src="${url}" type="text/javascript"></script>
      <style>
        .kronolith_embedded {
          overflow-x: scroll;
        }
        .kronolith_embedded .title {
          display: none;
        }
        .kronolith_embedded .title a {
          color: white !important;
        }
      </style>
    </head>
    <body>
      <div id="kronolithCal"></div>
    </body>
  </html>
  `

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}
