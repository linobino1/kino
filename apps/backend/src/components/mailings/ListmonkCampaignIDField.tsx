'use client'

import type { Mailing } from '@app/types/payload'
import type { TextFieldClientProps } from 'payload'
import React from 'react'
import { Button, FieldLabel, useField, useForm } from '@payloadcms/ui'

type Props = TextFieldClientProps & {
  listmonkURL: string
}

export const ListmonkCampaignIDField = ({ field: { label }, listmonkURL }: Props) => {
  const { value } = useField<Mailing['listmonkCampaignID']>({
    path: 'listmonkCampaignID',
  })
  const { submit } = useForm()

  const handleCreate = async () => {
    await submit() // make sure we use the current state of the form
    await submit({ overrides: { listmonkAction: 'create' } })
  }

  const handleUpdate = async () => {
    // confirm(`Wenn du fortfährst, wird die Kampagne ${value} in Listmonk aktualisiert.`)
    await submit() // make sure we use the current state of the form
    await submit({ overrides: { listmonkAction: 'update' } })
  }

  const handleDelete = async () => {
    confirm(`Wenn du fortfährst, wird die Kampagne ${value} in Listmonk gelöscht.`)
    await submit({ overrides: { listmonkAction: 'delete' } })
  }

  return (
    <>
      <FieldLabel label={label} />
      <div className="my-4 flex flex-col items-start gap-4">
        {value ? (
          <>
            <a href={`${listmonkURL}/admin/campaigns/${value}`} target="_blank" rel="noreferrer">
              <Button className="m-0" buttonStyle="secondary">
                in Listmonk bearbeiten ↗
              </Button>
            </a>
            <Button className="m-0" onClick={handleUpdate}>
              Kampagne aktualisieren
            </Button>
            <Button className="m-0 text-sm opacity-70" buttonStyle="none" onClick={handleDelete}>
              Kampagne löschen
            </Button>
          </>
        ) : (
          <Button className="m-0" onClick={handleCreate}>
            Kampagne erstellen
          </Button>
        )}
      </div>
    </>
  )
}
