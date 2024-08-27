import type {
  LoaderFunctionArgs,
  LinksFunction,
  MetaFunction,
  HeadersFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
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
import type { Media } from "payload/generated-types";
import environment from "./util/environment";
import classes from "./root.module.css";
import { ErrorPage } from "~/components/ErrorPage";
import type { MovieTheater, WithContext } from "schema-dts";
import { locationSchema } from "cms/structured-data/location";
import { addContext } from "cms/structured-data";
import { cacheControlShortWithSWR } from "./util/cache-control/cacheControlShortWithSWR";
import { returnLanguageIfSupported } from "./i18n";
import { getHreflangLinks } from "./util/getHreflangLinks";

export const ErrorBoundary = ErrorPage;

export const links: LinksFunction = () => {
  return [
    // use css bundling
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  ];
};

export async function loader({
  request,
  params: { lang },
  context: { payload, user },
}: LoaderFunctionArgs) {
  const locale =
    returnLanguageIfSupported(lang) ?? (await i18next.getLocale(request));

  const site = await payload.findGlobal({
    slug: "site",
    depth: 3,
    locale,
  });

  return json(
    {
      user,
      site,
      locale,
      publicKeys: {
        PAYLOAD_PUBLIC_SERVER_URL: environment().PAYLOAD_PUBLIC_SERVER_URL,
        HCAPTCHA_SITE_KEY: environment().HCAPTCHA_SITE_KEY,
        TIMEZONE: environment().TIMEZONE,
        NODE_ENV: environment().NODE_ENV,
        MAILCHIMP_SIGNUP_URL: environment().MAILCHIMP_SIGNUP_URL,
        CDN_CGI_IMAGE_URL: environment().CDN_CGI_IMAGE_URL,
      },
    },
    {
      headers: {
        "Cache-Control": cacheControlShortWithSWR,
        "Content-Language": locale,
      },
    }
  );
}

export const headers: HeadersFunction = ({ loaderHeaders }) => ({
  "Cache-Control": loaderHeaders.get("Cache-Control") as string,
  "Content-Language": loaderHeaders.get("Content-Language") as string,
});

export const meta: MetaFunction<typeof loader> = ({
  data,
  location: { pathname },
}) => {
  return [
    ...getHreflangLinks(pathname),
    {
      tagName: "link",
      rel: "icon",
      href: (data?.site.favicon as Media)?.url as string,
      type: (data?.site.logo as Media)?.mimeType,
    },
    {
      charSet: "utf-8",
    },
    {
      title: data?.site.meta?.title,
    },
    {
      name: "description",
      content: data?.site.meta?.description,
    },
    {
      name: "keywords",
      content: data?.site.meta?.keywords,
    },
    {
      name: "viewport",
      content: "width=device-width,initial-scale=1",
    },
    {
      name: "og:image",
      content:
        data?.site.meta?.image &&
        encodeURI((data.site.meta.image as any)?.sizes["1500w"].url),
    },
    {
      name: "og:title",
      content: data?.site.meta?.title,
    },
    {
      name: "og:description",
      content: data?.site.meta?.description,
    },
  ];
};

export const handle = {
  i18n: "common", // i18n namespace
};

export function useChangeLanguage(locale: string) {
  const { i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(locale);
    document.cookie = `i18n=${locale}; path=/; samesite=strict`;
  }, [locale, i18n]);
}

export default function App() {
  // Get the locale from the loader
  const { locale, publicKeys, site } = useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation();

  // handle locale change
  useChangeLanguage(locale);

  const structuredData: WithContext<MovieTheater> = addContext(
    locationSchema(site)
  );

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <Meta />
        <Links />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className={classes.body}>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(publicKeys)}`,
          }}
        />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {false && (
          <div className={classes.cookiesWrapper}>
            <CookieConsent
              location="bottom"
              buttonText={t("Accept")}
              declineButtonText={t("Decline")}
              enableDeclineButton
              containerClasses={classes.cookies}
              buttonWrapperClasses={classes.cookieButtons}
              buttonClasses={classes.cookieButtonAccept}
              declineButtonClasses={classes.cookieButtonDecline}
              contentClasses={classes.cookieContent}
            >
              {t("CookieBannerText")}
            </CookieConsent>
          </div>
        )}
      </body>
    </html>
  );
}
