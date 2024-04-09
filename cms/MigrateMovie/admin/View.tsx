import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { DefaultTemplate } from "payload/components/templates";
import type { AdminViewConfig } from "payload/config";
import { useStepNav } from "payload/components/hooks";
import { useConfig, Meta } from "payload/components/utilities";
import MigrateMovie from "../component";
import { useTranslation } from "react-i18next";

export const MigrateMovieView: AdminViewConfig = {
  path: "/migrate-movie",
  Component: ({ user, canAccessAdmin }) => {
    const {
      routes: { admin: adminRoute },
    } = useConfig();
    const { setStepNav } = useStepNav();
    const { t } = useTranslation();
    const label: string = t("Migrate Movie");

    // This effect will only run one time and will allow us
    // to set the step nav to display our custom route name
    useEffect(() => {
      setStepNav([
        {
          label,
        },
      ]);
    }, [setStepNav, label]);

    // If an unauthorized user tries to navigate straight to this page,
    // Boot 'em out
    if (!user || (user && !canAccessAdmin)) {
      return <Redirect to={`${adminRoute}`} />;
    }

    return (
      <DefaultTemplate>
        <Meta
          title={t("Migrate Movie")}
          description="Building custom routes into Payload is easy."
          keywords="Custom React Components, Payload, CMS"
        />
        <div className="gutter--left gutter--right">
          <h1>{t("Migrate Movie")} </h1>
          <MigrateMovie />
        </div>
      </DefaultTemplate>
    );
  },
};

export default MigrateMovieView;
