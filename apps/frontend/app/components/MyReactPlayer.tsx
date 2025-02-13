import { useState } from 'react'
import ReactPlayer, { type ReactPlayerProps } from 'react-player'
import { useTranslation } from 'react-i18next'
import { classes } from '~/classes'

export type Props = ReactPlayerProps

export const MyReactPlayer: React.FC<Props> = (props) => {
  const { t } = useTranslation()

  // loading and error state
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  return (
    <div className={`${classes.container} ${isLoading && classes.loading}`}>
      <ReactPlayer
        {...props}
        width={'100%'}
        height={'100%'}
        controls={true}
        onReady={() => setIsLoading(false)}
        onError={() => setIsError(true)}
      />
      {isError && (
        <p className={classes.message}>
          {t('Video is not available.')}
          <br />
          {typeof props.url === 'string' ? props.url : ''}
        </p>
      )}
      {isLoading && <p className={classes.message}>{t('Loading...')}</p>}
    </div>
  )
}
