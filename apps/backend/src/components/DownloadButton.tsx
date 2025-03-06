'use client'

import { Button, useField, type TextInputProps } from '@payloadcms/ui'

type Props = {
  path: string
  field: TextInputProps
}

export const DownloadButton: React.FC<Props> = ({ path, field: { label } }) => {
  const { value } = useField({ path })
  return typeof value === 'string' ? (
    <a href={value}>
      <Button>{`${label ?? 'Download'}`}</Button>
    </a>
  ) : null
}
