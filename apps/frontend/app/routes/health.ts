export const loader = async () =>
  new Response('OK', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  })
