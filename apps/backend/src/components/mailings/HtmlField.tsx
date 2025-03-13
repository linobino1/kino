'use client'

import type { TextFieldClientProps } from 'payload'
import React, { useEffect } from 'react'
import { Button, FieldLabel, useField } from '@payloadcms/ui'

export const HtmlField = ({ field: { label } }: TextFieldClientProps) => {
  const { value } = useField({ path: 'html' })
  const [copied, setCopied] = React.useState(false)

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false)
      }, 5000)
      return () => clearTimeout(timeout)
    }
  }, [copied])

  return (
    <div>
      <div className="my-2 flex items-center">
        <FieldLabel label={label} unstyled />
        {typeof value === 'string' && value.length > 0 && (
          <Button
            buttonStyle="secondary"
            size="small"
            className="my-0 ml-2"
            onClick={(e) => {
              e.preventDefault()
              navigator.clipboard.writeText(value)
              if (copied) {
                setCopied(false)
                window.setTimeout(() => setCopied(true), 100)
              } else {
                setCopied(true)
              }
            }}
          >
            {'In die Zwischenablage kopieren'}
          </Button>
        )}
        {copied && <span style={{ marginLeft: 5 }}>{'✅'}</span>}
      </div>
      {typeof value === 'string' && value.length > 0 ? (
        <iframe
          title="preview"
          width={750}
          height={3500}
          srcDoc={value ?? ''}
          style={{ maxHeight: '80vh', maxWidth: '100%', marginTop: 0 }}
        />
      ) : (
        <p>{'nicht verfügbar'}</p>
      )}
    </div>
  )
}
