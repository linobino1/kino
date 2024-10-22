import { classes } from '~/classes'

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'small' | 'medium' | 'large'
}

export const Gutter: React.FC<Props> = ({ size = 'medium', className, ...props }) => {
  return (
    <div className={[classes.gutter, classes[size], className].filter(Boolean).join(' ')}>
      {props.children}
    </div>
  )
}

export default Gutter
