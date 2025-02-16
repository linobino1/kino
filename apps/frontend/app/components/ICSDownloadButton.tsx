import type { Event } from '@app/types/payload'
import { cn } from '@app/util/cn'
import { Form } from 'react-router'
import { useTranslation } from 'react-i18next'

type Props = React.HTMLAttributes<HTMLButtonElement> & {
  events: Event[]
  showLabel?: boolean
}

export const ICSDownloadButton: React.FC<Props> = ({ events, showLabel = true, className }) => {
  const { i18n, t } = useTranslation()

  // exclude past events
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  events = events.filter((e) => e.date > today.toISOString())

  const label = t('ics.button.add', { count: events.length })

  return (
    <Form method="post" action={`/api/ics`} reloadDocument navigate={false} className="contents">
      {events.map((event, index) => (
        <input key={index} type="hidden" name="events[]" value={event.id} />
      ))}
      <input type="hidden" name="locale" value={i18n.language} />
      <button
        type="submit"
        className="contents"
        title={!showLabel ? label : undefined}
        aria-label={!showLabel ? label : undefined}
      >
        {showLabel && label}
        <div className={cn('i-material-symbols:calendar-add-on text-xl', className)} />
      </button>
    </Form>
  )
}
