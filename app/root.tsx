import type {
  LoaderFunctionArgs,
  LinksFunction,
  MetaFunction,
  HeadersFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
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
import { returnLanguageIfSupported, supportedLngs } from "./i18n";
import { getHreflangLinks } from "./util/getHreflangLinks";
import { localizeTo } from "./components/localized-link/util/localizeTo";
import { i18nCookie } from "./cookie";
import { useChangeLanguage } from "remix-i18next";
import { withSentry } from "@sentry/remix";

export const ErrorBoundary = ErrorPage;

export const links: LinksFunction = () => {
  return [
    // use css bundling
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  ];
};

export async function loader({
  request,
  // parmams.lang doesn't reliably get the language from the URL, request.url does
  // params: { lang },
  context: { payload, user },
}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const urlLang = returnLanguageIfSupported(url.pathname.split("/")[1]);

  // If we're not already on a localized URL, redirect to the one that i18next thinks is best
  if (!urlLang && url.pathname !== "/") {
    const requestLang = await i18next.getLocale(request);
    const to = localizeTo(url.pathname, requestLang) as string;
    throw redirect(to);
  }

  const locale = urlLang as string;

  const [site, serializedI18nCookie] = await Promise.all([
    payload.findGlobal({
      slug: "site",
      depth: 3,
      locale,
    }),
    i18nCookie.serialize(locale),
  ]);

  return json(
    {
      user,
      site,
      locale,
      serializedI18nCookie,
      publicKeys: {
        PAYLOAD_PUBLIC_SERVER_URL: environment().PAYLOAD_PUBLIC_SERVER_URL,
        HCAPTCHA_SITE_KEY: environment().HCAPTCHA_SITE_KEY,
        TIMEZONE: environment().TIMEZONE,
        NODE_ENV: environment().NODE_ENV,
        MAILCHIMP_SIGNUP_URL: environment().MAILCHIMP_SIGNUP_URL,
        CDN_CGI_IMAGE_URL: environment().CDN_CGI_IMAGE_URL,
        SENTRY_DSN: environment().SENTRY_DSN,
        BUILD_NUMBER: environment().BUILD_NUMBER || "dev",
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

function App() {
  // Get the locale from the loader
  const { locale, serializedI18nCookie, publicKeys, site } =
    useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation();

  // handle locale change
  useChangeLanguage(locale);

  // Set locale cookie
  useEffect(() => {
    document.cookie = serializedI18nCookie;
  }, [serializedI18nCookie]);

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
        <ScrollRestoration
          getKey={(location) => {
            // strip locale from pathname
            const regex = new RegExp(`^/(${supportedLngs.join("|")})`);
            return (
              location.pathname.replace(regex, "/").replace("//", "/") +
              location.search +
              location.hash
            );
          }}
        />
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

export default withSentry(App);
