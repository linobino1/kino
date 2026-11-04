const labels = {
  alertname: 'PlakatScraperFailed',
  job: 'plakat-scraper',
  severity: 'warning',
}

export async function reportRun(success: boolean, error?: unknown) {
  const alertmanagerUrl = Deno.env.get('ALERTMANAGER_URL')
  if (!alertmanagerUrl) {
    console.info(
      'ALERTMANAGER_URL is not set; skipping Alertmanager notification.',
    )
    return
  }

  const now = new Date()
  const startsAt = success ? new Date(now.getTime() - 60 * 60 * 1000) : now
  const endsAt = success ? now : new Date(now.getTime() + 60 * 60 * 1000)
  const description = success
    ? 'The plakat scraper completed successfully.'
    : error instanceof Error
    ? error.stack ?? error.message
    : String(error)

  const response = await fetch(
    `${alertmanagerUrl.replace(/\/+$/, '')}/api/v2/alerts`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{
        labels,
        annotations: {
          summary: success
            ? 'Plakat scraper recovered'
            : 'Plakat scraper run failed',
          description,
        },
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
      }]),
    },
  )

  if (!response.ok) {
    throw new Error(
      `Alertmanager returned ${response.status} ${response.statusText}`,
    )
  }
}
