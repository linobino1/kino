import { useState } from 'react'
import ReactPlayer from 'react-player'
import { useTranslation } from 'react-i18next'

export type Props = React.ComponentProps<typeof ReactPlayer>

export const VideoEmbed: React.FC<Props> = (props) => {
  const { t } = useTranslation()

  // loading and error state
  const [isError, setIsError] = useState(false)

  return (
    <div>
      <ReactPlayer
        {...props}
        style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}
        controls={true}
        onError={() => setIsError(true)}
      />
      {isError && (
        <p>
          {t('Video is not available.')}
          <br />
          {typeof props.src === 'string' ? props.src : ''}
        </p>
      )}
    </div>
  )
}
