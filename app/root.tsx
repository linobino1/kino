import type { MetaFunction, SerializeFrom } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";
import i18next from "~/i18next.server";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import type { LinksFunction } from "@remix-run/node";
import { cssBundleHref } from "@remix-run/css-bundle";
import styles from "./root.module.css";
import { i18nCookie } from "./cookie";
import type { DynamicLinksFunction } from "remix-utils";
import { ExternalScripts } from "remix-utils";
import { DynamicLinks } from "remix-utils";
import { mediaUrl } from "./util/mediaUrl";
import type { Media} from "payload/generated-types";
import environment from "./util/environment";
import CookieConsent from "react-cookie-consent";
import classes from "./root.module.css";

export const links: LinksFunction = () => {
  return [
    // use css bundling
    ...(cssBundleHref
      ? [{ rel: "stylesheet", href: cssBundleHref }]
      : []),
  ];
};

export async function loader({ request, context: { payload, user } }: LoaderArgs) {
  let locale = await i18next.getLocale(request);
  const [site, localeCookie] = await Promise.all([
    payload.findGlobal({
      slug: 'site',
      depth: 1,
    }),
    i18nCookie.serialize(locale),
  ]);

  return json({
    user,
    site,
    locale,
    publicKeys: {
      PAYLOAD_PUBLIC_SERVER_URL: environment().PAYLOAD_PUBLIC_SERVER_URL,
      HCAPTCHA_SITE_KEY: environment().HCAPTCHA_SITE_KEY,
      TIMEZONE: environment().TIMEZONE,
    },
  }, {
    headers: {
      "Set-Cookie": localeCookie,
    },
  })
}

export const dynamicLinks: DynamicLinksFunction<SerializeFrom<typeof loader>> = ({ data }) => {
  return [
    {
      rel: "icon",
      href: mediaUrl((data.site.favicon as Media)?.filename as string),
      type: (data.site.logo as Media)?.mimeType,
    },
  ]
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  charset: "utf-8",
  title: data.site.title,
  description: data.site.meta?.description,
  keywords: data.site.meta?.keywords,
  viewport: "width=device-width,initial-scale=1",
});

export const handle = {
  i18n: "common", // i18n namespace
  dynamicLinks,
};

export function useChangeLanguage(locale: string) {
  const { i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale, i18n]);
}

export function ErrorBoundary() {
  let error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  }
  
  // display info about the error in development
  return environment().NODE_ENV === 'development' ? (
    error instanceof Error ? (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    ) : (
      <pre>{'Unknown Error'}</pre>
    )
  ) : (
    <h1>Something went wrong</h1>
  );
}

export default function App() {
  // Get the locale from the loader
  let { locale, publicKeys } = useLoaderData<typeof loader>();
  let { t, i18n } = useTranslation();

  // handle locale change
  useChangeLanguage(locale);

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <Meta />
        <Links />
        <DynamicLinks />
      </head>
      <body className={styles.body}>
        <ExternalScripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(publicKeys)}`,
          }}
        />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <div className={classes.cookiesWrapper}>
          <CookieConsent
            location="bottom"
            buttonText={t('Accept')}
            declineButtonText={t('Decline')}
            enableDeclineButton
            containerClasses={classes.cookies}
            buttonWrapperClasses={classes.cookieButtons}
            buttonClasses={classes.cookieButtonAccept}
            declineButtonClasses={classes.cookieButtonDecline}
            contentClasses={classes.cookieContent}
          >
            { t('CookieBannerText')}
          </CookieConsent>
        </div>
      </body>
    </html>
  );
}
