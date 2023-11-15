import {
  DynamicLinks,
  ExternalScripts,
  type DynamicLinksFunction
} from "remix-utils";
import type {
  MetaFunction,
  SerializeFrom,
  LoaderArgs,
  LinksFunction
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import i18next from "~/i18next.server";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import CookieConsent from "react-cookie-consent";
import { cssBundleHref } from "@remix-run/css-bundle";
import { i18nCookie } from "./cookie";
import type { Media} from "payload/generated-types";
import environment from "./util/environment";
import classes from "./root.module.css";
import { ErrorPage } from "~/components/ErrorPage";
import type { MovieTheater, WithContext } from "schema-dts";
import { locationSchema } from "cms/structured-data/location";
import { addContext } from "cms/structured-data";
import { ModalContainer, ModalProvider } from "@faceless-ui/modal";

export const ErrorBoundary = ErrorPage;

export const links: LinksFunction = () => {
  return [
    // use css bundling
    ...(cssBundleHref
      ? [{ rel: "stylesheet", href: cssBundleHref }]
      : []),
  ];
};

export async function loader({ request, context: { payload, user } }: LoaderArgs) {
  const locale = await i18next.getLocale(request);
  const [site, localeCookie] = await Promise.all([
    payload.findGlobal({
      slug: 'site',
      depth: 3,
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
      NODE_ENV: environment().NODE_ENV,
      MAILCHIMP_SIGNUP_URL: environment().MAILCHIMP_SIGNUP_URL,
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
      href: (data.site.favicon as Media)?.url as string,
      type: (data.site.logo as Media)?.mimeType,
    },
  ]
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  charset: "utf-8",
  title: data.site.meta?.title,
  description: data.site.meta?.description,
  keywords: data.site.meta?.keywords,
  viewport: "width=device-width,initial-scale=1",
  'og:image': data.site.meta?.image && encodeURI((data.site.meta.image as any)?.sizes['1500w'].url),
  'og:title': data.site.meta?.title,
  'og:description': data.site.meta?.description,
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

export default function App() {
  // Get the locale from the loader
  const { locale, publicKeys, site } = useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation();

  // handle locale change
  useChangeLanguage(locale);
  

  const structuredData: WithContext<MovieTheater> = addContext(locationSchema(site));

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <Meta />
        <Links />
        <DynamicLinks />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className={classes.body}>
        <ExternalScripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(publicKeys)}`,
          }}
        />
        <ModalProvider transTime={200} zIndex={200}>
          <Outlet />
          <ModalContainer />
        </ModalProvider>
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
