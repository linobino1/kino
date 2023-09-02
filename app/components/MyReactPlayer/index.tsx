import type { ReactPlayerProps } from "react-player"
import ReactPlayer from "react-player"
import classes from './index.module.css'
import { useState } from "react"

export interface Props extends ReactPlayerProps {
}

export const MyReactPlayer: React.FC<Props> = (props) => {
  // is loading
  const [isLoading, setIsLoading] = useState(true);
  const handleReady = (player: any) => {
    console.log('player', player)
    setIsLoading(false);
    player.wrapper.className = classes.player
  }
  return (
    <div className={`${classes.container} ${isLoading && classes.loading}`}>
      <ReactPlayer
        {...props}
        width={'100%'}
        height={'100%'}
        controls={true}
        onReady={handleReady}
      />
    </div>
  )
}