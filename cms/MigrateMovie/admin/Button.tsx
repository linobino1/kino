import React from "react";
import { useConfig } from "payload/components/utilities";
import { Button } from "payload/components/elements";
import { useTranslation } from "react-i18next";
import "./Button.scss";

export const MigrateMovieButton: React.FC = () => {
  const {
    routes: { admin: adminRoute },
  } = useConfig();
  const { t } = useTranslation();

  return (
    <p>
      <Button
        el="link"
        to={`${adminRoute}/migrate-movie`}
        buttonStyle="secondary"
        className="button"
        size="small"
      >
        {t("Migrate a movie from themoviedb.org")}
      </Button>
    </p>
  );
};

export default MigrateMovieButton;
