import React from "react";
import classes from "./index.module.css";
import type {
  FilmPrint,
  Media,
  Movie,
  Screening,
  ScreeningSery,
} from "payload/generated-types";
import { Date } from "~/components/Date";
import { useTranslation } from "react-i18next";
import Image from "~/components/Image";

type Props = {
  screening: Screening;
  activeScreeningSery?: ScreeningSery;
};

export const ScreeningsListItem: React.FC<Props> = ({
  screening,
  activeScreeningSery,
}) => {
  const { t } = useTranslation();

  return (
    <div className={classes.item}>
      <div className={classes.date}>
        <Date
          iso={screening.date as string}
          className={classes.dayName}
          format="EEEEEE"
        />
        <Date
          iso={screening.date as string}
          className={classes.month}
          format="MMM"
        />
        <Date
          iso={screening.date as string}
          className={classes.dayNumber}
          format="dd"
        />
      </div>
      <Image
        image={
          ((screening.films[0].filmprint as FilmPrint)?.movie as Movie)
            ?.still as Media
        }
        alt={t("movie still") as string}
        srcSet={[
          { options: { width: 310, height: 310, fit: "crop" }, size: "310w" },
          { options: { width: 450, height: 450, fit: "crop" }, size: "450w" },
          { options: { width: 620, height: 620, fit: "crop" }, size: "620w" },
          { options: { width: 900, height: 900, fit: "crop" }, size: "900w" },
        ]}
        sizes="(max-width: 500px) 100vw, (max-width: 700px) 50vw, (max-width: 1024px) 33vw, 310px"
      />
      <div className={classes.info}>
        <div className={classes.tags}>
          {screening.series &&
            activeScreeningSery?.id !==
              (screening.series as ScreeningSery)?.id && (
              <div className={`${classes.tag} ${classes.series}`}>
                {(screening.series as ScreeningSery).name}
              </div>
            )}
        </div>
        <Date
          iso={screening.date as string}
          className={classes.time}
          format="p"
        />
        <div className={classes.title}>{screening.title}</div>
        <div className={classes.footer}>{t("More Info")}</div>
      </div>
    </div>
  );
};

export default ScreeningsListItem;
