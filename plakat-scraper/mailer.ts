const ZEPTOMAIL_URL = 'https://cpaas.zoho.eu/v1.1/email'
const EMAIL_FROM = {
  address: 'noreply@kinoimblauensalon.de',
  name: 'noreply',
}
const EMAIL_TO = ['leo.hilsheimer@googlemail.com', 'pl@kinoimblauensalon.de']

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export const sendMail = async (options: { subject: string; text: string }) => {
  if (Deno.env.get('ENV') !== 'production') {
    console.log('Not in production, skipping email send.')
    console.log(options)
    return
  }

  const apiKey = Deno.env.get('PLAKAT_SCRAPER_ZEPTOMAIL_API_KEY')
  if (!apiKey) {
    throw new Error('Missing PLAKAT_SCRAPER_ZEPTOMAIL_API_KEY environment variable')
  }

  try {
    const response = await fetch(ZEPTOMAIL_URL, {
      method: 'POST',
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: EMAIL_TO.map((address) => ({ email_address: { address } })),
        subject: options.subject,
        htmlbody: `<div>${escapeHtml(options.text).replaceAll('\n', '<br>')}</div>`,
      }),
    })

    if (!response.ok) {
      const responseBody = await response.text()
      throw new Error(
        `ZeptoMail request failed (${response.status} ${response.statusText}): ${responseBody}`,
      )
    }

    console.log('Email sent successfully')
  } catch (error) {
    console.error('Error sending email through ZeptoMail:', error)
    throw error
  }
}
