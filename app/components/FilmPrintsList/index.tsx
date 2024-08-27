import { FilmPrintsListItem } from "./item";
import type { FilmPrint } from "payload/generated-types";
import React from "react";
import { useTranslation } from "react-i18next";
import classes from "./index.module.css";
import { Link } from "~/components/localized-link";

export type Props = {
  from?: string;
  items: FilmPrint[];
  className?: string;
};

export const FilmPrintsList: React.FC<Props> = ({ items, className }) => {
  const { t } = useTranslation();

  return items?.length ? (
    <ul className={`${classes.list} ${className || ""}`}>
      {items.map((item) => (
        <li key={item.id}>
          <Link key={item.id} to={`${item.slug as string}`} prefetch="intent">
            <FilmPrintsListItem item={item} />
          </Link>
        </li>
      ))}
    </ul>
  ) : (
    <div className={classes.empty}>{t("No films matching your search.")}</div>
  );
};

export default FilmPrintsList;
