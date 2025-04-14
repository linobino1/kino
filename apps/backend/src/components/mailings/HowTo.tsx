import { Gutter } from '@payloadcms/ui'
import React from 'react'

export const HowTo = () => {
  return (
    <Gutter className="mb-8 mt-4 opacity-70">
      <h3>Anleitung</h3>
      <p>Um einen neuen Newsletter zu verfassen, folge diesen Schritten:</p>
      <ol className="my-2 max-w-[600px] space-y-2 leading-tight">
        <li>
          Erstelle ein neues Element oder dupliziere das neueste Element in der Liste der
          Newsletter.
        </li>
        <li>Bearbeite den Inhalt nach Bedarf, eine Vorschau wird unten angezeigt.</li>
        <li>Klicke auf &quot;Speichern&quot;.</li>
        <li>
          Klicke auf &quot;Kampagne erstellen&quot; in der rechten Seitenleiste, um die Kampagne im
          unserem Newslettersystem Listmonk zu erstellen.
        </li>
        <li>
          Klicke auf &quot;in Listmonk bearbeiten&quot; und melde dich unter dem sich öffnenden Link
          an.
        </li>
        <li>
          In der Kampagnenansicht bei Listmonk kannst du nochmal alle Daten prüfen und die Kampagne
          dann freischalten mit dem Button &quot;Schedule campaign&quot; rechts oben.
        </li>
      </ol>
    </Gutter>
  )
}
