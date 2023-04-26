import type { Still as StillType } from "payload/generated-types"
import type { Props as ImageProps} from "~/components/Image";
import Image from "~/components/Image";
import React from "react"
import { useTranslation } from "react-i18next"
import { mediaUrl } from "~/util/mediaUrl"

const url = (filename: string): string => mediaUrl(`stills/${filename}`)

export interface Props extends Omit<ImageProps, 'image'> {
  image: StillType
}

export const Still: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  
  return (
    <Image
      {...props}
      alt={t('movie still') as string}
      loader={url}
    />
  )
}

export default Still;
