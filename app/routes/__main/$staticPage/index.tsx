/* eslint-disable no-case-declarations */
import React from 'react';
import type { LoaderArgs, MetaFunction} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import i18next from "~/i18next.server";
import {
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import { Response } from '@remix-run/node';
import classes from './index.module.css';
import Page from '~/components/Page';


export const loader = async ({ request, params, context: { payload }}: LoaderArgs) => {
  const locale = await i18next.getLocale(request);
  const res = await payload.find({
    collection: 'staticPages',
    where: {
      slug: {
        equals: params?.staticPage,
      },
    },
    locale,
  });
  if (!res.docs.length) {
    throw new Response('Page not found', { status: 404 })
  }
  return {
    page: res.docs[0],
  }
}

export const meta: MetaFunction = ({ data, parentsData }) => ( data && {
  charset: "utf-8",
  title: data.page?.title || parentsData.root?.site?.title,
  description: data.page?.meta?.description || parentsData?.root?.site?.meta?.description,
  keywords: `${data.page?.meta?.keywords || ''} ${parentsData?.root?.site?.meta?.keywords || ''}`.trim(),
  viewport: "width=device-width,initial-scale=1",
});

export const StaticPage: React.FC = () => {
  const { page } = useLoaderData<typeof loader>();
  
  return (
    <Page layout={page.layout} />
  );
};

export function ErrorBoundary() {
  let error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className={classes.error}>
        <h1>
          {error.status} {error.data}
        </h1>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}

export default StaticPage;