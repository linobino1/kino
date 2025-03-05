import type { Event } from '@app/types/payload'

type Props = {
  title: string
  events: Event[]
}

export const PressPDF: React.FC<Props> = ({ title, events }) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>{'adsf'}</p>
    </div>
  )
}
