import React from "react";
import { Link, useMatches } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import classes from "./index.module.css";
import type { User } from "payload/generated-types";

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const UserStatus: React.FC<Props> = ({ className }) => {
  const { t } = useTranslation();
  const rootData = useMatches().find((x) => x.id === "root")?.data;
  const user = (rootData &&
    typeof rootData === "object" &&
    "user" in rootData &&
    rootData.user) as User;

  return (
    <div className={`${classes.container} ${className}`}>
      {user ? (
        <div className={classes.signedIn}>
          <Link to="/auth/me" className={classes.name}>
            {t("signed in as {{name}}", { name: user.name })}
          </Link>
          <Link to="/admin" className={classes.admin} target="_blank">
            {t("backend")}
          </Link>
        </div>
      ) : (
        <Link to="/auth/signin" className={classes.signIn}>
          {t("Sign In")}
        </Link>
      )}
    </div>
  );
};
