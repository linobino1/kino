import type { Poster as PosterType } from "payload/generated-types"
import type { Props as ImageProps} from "~/components/Image";
import Image from "~/components/Image";
import React from "react"
import { useTranslation } from "react-i18next"
import { mediaUrl } from "~/util/mediaUrl"

const url = (filename: string): string => mediaUrl(`posters/${filename}`)

export interface Props extends Omit<ImageProps, 'image'> {
  image: PosterType
}

export const Poster: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  
  return (
    <Image
      loader={url}
      alt={t('movie poster') as string}
      {...props}
    />
  )
}

export default Poster;
