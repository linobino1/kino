import { useState } from 'react'
import ReactPlayer, { type ReactPlayerProps } from 'react-player'
import { useTranslation } from 'react-i18next'

export type Props = ReactPlayerProps

export const MyReactPlayer: React.FC<Props> = (props) => {
  const { t } = useTranslation()

  // loading and error state
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  return (
    <div>
      <ReactPlayer
        {...props}
        width={'100%'}
        height={'100%'}
        controls={true}
        onReady={() => setIsLoading(false)}
        onError={() => setIsError(true)}
      />
      {isError && (
        <p>
          {t('Video is not available.')}
          <br />
          {typeof props.url === 'string' ? props.url : ''}
        </p>
      )}
      {isLoading && <p>{t('Loading...')}</p>}
    </div>
  )
}
