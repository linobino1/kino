function getConfiguration() {
  const bucket = Deno.env.get('PLAKAT_SCRAPER_STATE_BUCKET')
  const endpoint = Deno.env.get('S3_ENDPOINT')
  const accessKeyId = Deno.env.get('S3_ACCESS_KEY')
  const secretAccessKey = Deno.env.get('S3_SECRET_KEY')
  if (!bucket || !endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error('Missing R2 state storage configuration')
  }

  return {
    bucket,
    key: 'plakat-scraper-state.json',
    endpoint,
    accessKeyId,
    secretAccessKey,
  }
}

export async function getState(): Promise<boolean> {
  const { bucket, key, endpoint, accessKeyId, secretAccessKey } = getConfiguration()
  const { GetObjectCommand, S3Client } = await import('@aws-sdk/client-s3')
  const client = new S3Client({
    endpoint,
    region: 'auto',
    credentials: { accessKeyId, secretAccessKey },
  })
  try {
    const response = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }))
    return response.Body ? JSON.parse(await response.Body.transformToString()) === true : false
  } catch (error) {
    if (
      error instanceof Error &&
      (('name' in error && error.name === 'NoSuchKey') ||
        ('$metadata' in error &&
          (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode === 404))
    ) {
      return false
    }
    throw error
  } finally {
    client.destroy()
  }
}

export async function saveState(state: boolean) {
  const { bucket, key, endpoint, accessKeyId, secretAccessKey } = getConfiguration()
  const { PutObjectCommand, S3Client } = await import('@aws-sdk/client-s3')
  const client = new S3Client({
    endpoint,
    region: 'auto',
    credentials: { accessKeyId, secretAccessKey },
  })
  try {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: JSON.stringify(state),
        ContentType: 'application/json',
      }),
    )
  } finally {
    client.destroy()
  }
}
