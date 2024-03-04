import React from "react";
import type {
  Country,
  FilmPrint,
  Media,
  Movie,
  Person,
} from "payload/generated-types";
import { useTranslation } from "react-i18next";
import { Image } from "~/components/Image";
import classes from "./index.module.css";

type Props = {
  item: FilmPrint;
};

export const FilmPrintsListItem: React.FC<Props> = ({ item }) => {
  const { t } = useTranslation();
  const movie = item.movie as Movie;

  return (
    <div className={classes.item}>
      <Image
        image={movie.still as Media}
        alt={t("movie still") as string}
        srcSet={[
          { options: { width: 500, height: 281, fit: "crop" }, size: "500w" },
          { options: { width: 768, height: 432, fit: "crop" }, size: "768w" },
          { options: { width: 1536, height: 864, fit: "crop" }, size: "1536w" },
        ]}
        sizes="(max-width: 1200px) 66vw, (max-width: 1000px) 50vw, (max-width: 768px) 100vw, 768px"
      />
      <div className={classes.overlay}>
        <div className={classes.title}>{movie.title}</div>
        <div className={classes.subtitle}>
          <b>
            {((movie.directors as Person[]) || [])
              .map((x) => x.name)
              .join(", ")}
          </b>{" "}
          {((movie.countries as Country[]) || []).map((x) => x.name).join(", ")}
          {", "}
          {movie.year}
        </div>
      </div>
      <div className={classes.info}>
        <div className={classes.synopsis}>{movie.synopsis}</div>
        <div className={classes.moreInfo}>{t("More Info")}</div>
      </div>
    </div>
  );
};

export default FilmPrintsListItem;
