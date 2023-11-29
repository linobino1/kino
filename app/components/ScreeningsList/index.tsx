import { ScreeningsListItem } from "./item";
import { Link } from "@remix-run/react";
import type { Screening, ScreeningSery, Site } from "payload/generated-types";
import React from "react";
import { useTranslation } from "react-i18next";
import classes from "./index.module.css";
import { JsonLd } from "cms/structured-data";
import { screeningsListSchema as screeningsListMarkup } from "cms/structured-data/screening";

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  from?: string;
  items: Screening[];
  site: Site;
  className?: string;
  activeScreeningSery?: ScreeningSery;
  emptyMessage?: string;
}

export const ScreeningsList: React.FC<Props> = ({
  items,
  className,
  activeScreeningSery,
  emptyMessage,
  site,
  ...props
}) => {
  const { t } = useTranslation();

  return items?.length ? (
    <div {...props} className={`${classes.list} ${className || ""}`}>
      {JsonLd(screeningsListMarkup(items, site))}
      {items.map((item) => (
        <Link
          key={item.id}
          to={`/screenings/${item.slug as string}`}
          prefetch="intent"
        >
          <ScreeningsListItem
            screening={item}
            activeScreeningSery={activeScreeningSery}
          />
        </Link>
      ))}
    </div>
  ) : (
    <div className={classes.empty}>
      {emptyMessage || t("No upcoming screenings.")}
    </div>
  );
};

export default ScreeningsList;
