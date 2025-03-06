'use client'

import { FieldLabel, useField, type TextInputProps } from '@payloadcms/ui'

type Props = {
  baseUrl: string
  path: string
  field: TextInputProps
}

export const UrlField: React.FC<Props> = ({
  baseUrl,
  path,
  field: { localized, required, label },
}) => {
  const { value: relativeUrl } = useField({ path })
  const absoluteUrl = `${baseUrl}${relativeUrl}`
  return typeof relativeUrl === 'string' ? (
    <>
      <FieldLabel label={label} localized={localized} path={path} required={required} />
      <a
        href={absoluteUrl}
        target="_blank"
        rel="noreferrer"
        className="mb-2 inline-block border-0 p-0 shadow-none outline-0"
      >
        {relativeUrl}
      </a>
    </>
  ) : null
}
