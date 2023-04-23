import React from "react"
import classes from "./index.module.css"
import { useTranslation } from 'react-i18next';

export interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  layout?: 'big' | 'submit' | 'cancel' | 'symbol' | undefined
  className?: string
  color?: 'white' | undefined
  children?: React.ReactNode
  type?: 'button' | 'submit'
  symbol?: 'close' | 'menu'
}

// export const imageUrl = (image: Media, width: number, height: number): string => mediaUrl(`${image.sizes.card.}`)
export const Button: React.FC<Props> = (props) => {
  let { t } = useTranslation();
  let { layout, color, symbol } = props;
  let updatedProps = { ...props };
  updatedProps.className = `${classes.button} ${props.className}`;
  
  // add aria-label to button if symbol is set
  if (symbol) {
    const symbolLabelMap = {
      close: t('Close'),
      menu: t('Menu'),
    }
    updatedProps["aria-label"] = symbolLabelMap[symbol];
  }
  
  return (
    <button
      data-layout={layout}
      data-color={color}
      data-symbol={symbol}
      {...updatedProps}
    >
      { props.children }
    </button>
  )
}

Button.defaultProps = Button.defaultProps || {};
Button.defaultProps['type'] = 'button';

export default Button;
