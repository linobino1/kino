'use client'

import { FieldLabel, useField } from '@payloadcms/ui'

type Props = {
  baseUrl: string
  path: string
}

export const UrlField: React.FC<Props> = ({ path, baseUrl }) => {
  const { value: relativeUrl } = useField({ path })
  const absoluteUrl = `${baseUrl}${relativeUrl}`
  return typeof relativeUrl === 'string' ? (
    <>
      <FieldLabel path={path} />
      <a href={absoluteUrl} target="_blank" rel="noreferrer" className="mb-2 inline-block">
        {relativeUrl}
      </a>
    </>
  ) : null
}
