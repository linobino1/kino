'use client'

import React, { useEffect } from 'react'
import { useField } from '@payloadcms/ui'

const stylesButton: React.CSSProperties = {
  fontWeight: 'bold',
  fontSize: 12,
  appearance: 'none',
  border: 'none',
  outline: 'none',
  background: '#3C3C3C',
  color: 'white',
  borderRadius: 5,
  cursor: 'pointer',
  margin: 0,
  padding: '5px 10px',
  marginLeft: 5,
}

const HtmlField = () => {
  const { value } = useField({ path: 'html' })
  const [copied, setCopied] = React.useState(false)
  const [showHowTo, setShowHowTo] = React.useState(false)

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
      <label className="field-label">
        {'HTML'}
        {typeof value === 'string' && value.length > 0 && (
          <button
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
            style={stylesButton}
          >
            {'In die Zwischenablage kopieren'}
          </button>
        )}
        {copied && <span style={{ marginLeft: 5 }}>{'✅'}</span>}
      </label>
      {typeof value === 'string' && value.length > 0 ? (
        <>
          {copied && !showHowTo && (
            <div
              onClick={() => setShowHowTo(true)}
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
              {"Wie geht's weiter?"}
            </div>
          )}
          {showHowTo && (
            <div
              style={{
                position: 'fixed',
                zIndex: 1000,
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                padding: '5vw',
                background: 'white',
              }}
            >
              <p>{'So verschickst du die eben verfasste Email:'}</p>
              <ol>
                <li>
                  {'Melde dich bei'}
                  <a
                    target="_blank"
                    href="https://news.kinoimblauensalon.de"
                    rel="noopener noreferrer"
                  >
                    news.kinoimblauensalon.de
                  </a>
                  {' an.'}
                </li>
                <li>{'Erstelle eine neue Kampagne'}</li>
                <li>
                  {
                    'Gib der Kampagne einen Namen (nicht wichtig), einen Betreff (wichtig) und weise sie der Liste `Newsletter` zu.'
                  }
                </li>
                <li>{'Klicke auf `Weiter`'}</li>
                <li>{'Navigiere zum `Content Editor`'}</li>
                <li>{'Wähle das Format `Raw HTML` aus'}</li>
                <li>{'Klicke auf `Speichern`'}</li>
                <li>{'Navigiere zurück zum `Kampagne` Tab'}</li>
                <li>{'Versende die Kampagne sofort oder richte einen Terminversand ein'}</li>
              </ol>
              <button style={stylesButton} onClick={() => setShowHowTo(false)}>
                {'Schließen'}
              </button>
            </div>
          )}
          <iframe
            title="preview"
            width={750}
            height={3500}
            srcDoc={value ?? ''}
            style={{ maxHeight: '80vh', marginTop: 0 }}
          />
        </>
      ) : (
        <p>{'nicht verfügbar'}</p>
      )}
    </div>
  )
}
export default HtmlField
