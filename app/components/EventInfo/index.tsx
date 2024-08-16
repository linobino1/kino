import type { Media, Event } from "payload/generated-types";
import React from "react";
import classes from "./index.module.css";
import { useTranslation } from "react-i18next";
import Image from "~/components/Image";
import RichText from "../RichText";

export interface Props extends React.HTMLAttributes<HTMLElement> {
  event: Event;
}

export const EventInfo: React.FC<Props> = ({ event, className, ...props }) => {
  const { t } = useTranslation();

  return (
    <div className={`${classes.container} ${className}`} {...props}>
      <Image
        className={classes.poster}
        image={event.poster as Media}
        alt={t("movie poster") as string}
        srcSet={[
          { options: { width: 260 }, size: "260w" },
          { options: { width: 520 }, size: "520w" },
        ]}
        sizes="260px"
      />
      <h2>{event.title}</h2>
      <div className={classes.subtitle}>{event.subtitle}</div>
      {event.info && <RichText className={classes.info} content={event.info} />}
    </div>
  );
};

export default EventInfo;
