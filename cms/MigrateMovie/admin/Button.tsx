import React from "react";
import { useConfig } from "payload/components/utilities";
import { Button } from "payload/components/elements";
import { useTranslation } from "react-i18next";
import "./Button.scss";

type Props = {
  newTab?: boolean;
};

export const MigrateMovieButton: React.FC<Props> = ({ newTab }) => {
  const {
    routes: { admin: adminRoute },
  } = useConfig();
  const { t } = useTranslation();

  return (
    <Button
      el="link"
      newTab={newTab}
      to={`${adminRoute}/migrate-movie`}
      buttonStyle="secondary"
      className="button"
      size="small"
    >
      {t("Migrate a movie from themoviedb.org")}
    </Button>
  );
};

export default MigrateMovieButton;
