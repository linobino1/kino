import type { MetaFunction } from "@remix-run/node";
import type { ActionFunction, LoaderArgs} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import { Page } from "~/components/Page";
import { FilmPrintsList } from "~/components/FilmPrintsList";
import classes from "./index.module.css";
import i18next from "~/i18next.server";
import { useTranslation } from "react-i18next";
import type { Payload } from "payload";
import type { FilmPrint } from "payload/generated-types";
import type { AppliedFilter} from "~/util/filter";
import { Filters } from "~/util/filter";
import { useRef } from "react";
import type { Where } from "payload/types";
import { pageDescription, pageKeywords, pageTitle } from "~/util/pageMeta";

export const loader = async ({ request, context: { payload }}: LoaderArgs) => {
  const locale = await i18next.getLocale(request);
  const page = await payload.findGlobal({
    slug: 'archive',
    locale,
  });
  
  // get all published film prints
  const filters = getFilters(payload);
  const filmPrints = await payload.find({
    collection: 'filmPrints',
    locale,
    depth: 7,
    where: filters.getWhereClause(),
  });
  
  return {
    page,
    filters: await filters.getApplied(),
    items: filmPrints.docs || [],
  }
};

export const meta: MetaFunction<typeof loader> = ({ data, parentsData }) => ({
  title: pageTitle(parentsData.root?.site?.meta?.title, data.page?.meta?.title),
  description: pageDescription(parentsData.root?.site?.meta?.description, data.page?.meta?.description),
  keywords: pageKeywords(parentsData.root?.site?.meta?.keywords, data.page?.meta?.keywords),
});

export const action: ActionFunction = async ({ request, context: { payload }}) => {
  const locale = await i18next.getLocale(request);
  const formData = await request.formData();
  const filters = getFilters(payload, formData);
  const filmPrints = await payload.find({
    collection: 'filmPrints',
    locale,
    depth: 7,
    where: filters.getWhereClause(),
  });
  
  const data = {
    items: filmPrints.docs || [],
    filters: await filters.getApplied(),
    query: formData.get('query') || '',
    depth: 7,
  }
  return json(data, { status: 200 });
}

const getFilters = (payload: Payload, formData?: FormData): Filters => {
  const query = formData && formData.get('query');
  const queryClause: Where | undefined = query ? {
    or: [
      {
        'movie.originalTitle': {
          contains: query,
        },
      },
      {
        'movie.title': {
          contains: query,
        },
      },
      {
        'movie.directors.name': {
          contains: query,
        },
      },
      {
        'movie.cast.name': {
          contains: query,
        },
      },
      {
        'movie.synopsis': {
          contains: query,
        },
      },
    ],
  } : undefined;
  const globalCause: Where | undefined = {
    and: [
      {
        isRented: {
          equals: false,
        },
      },
      queryClause || {},
    ],
  };
  const filters = new Filters({
    collection: 'filmPrints',
    payload,
    filters: [
      {
        name: 'movie.isHfgProduction',
        labelOff: 'HfG Production yes/no',
        labelTrue: 'only HfG Production',
        labelFalse: 'only non-HfG Production',
      },
      {
        name: 'movie.directors.name',
        labelOff: 'All Directors',
      },
    ],
    globalCause,
  });
  filters.apply(formData);
  return filters;
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { page } = loaderData;
  const data: { items: FilmPrint[], filters: AppliedFilter[], query?: string } = actionData || loaderData;
  const { items, filters, query } = data;
  const { t } = useTranslation();
  const form = useRef<HTMLFormElement>(null);
  const filterFetcher = useFetcher();
  
  return (
    <Page layout={page.layout}>
      <filterFetcher.Form
        ref={form}
        method="POST"
        className={classes.form}
      >
        <div className={classes.search}>
          <input
            type="search"
            name="query"
            defaultValue={query}
            placeholder={t('search...') || ''}
          />
          <button onClick={() => form.current?.submit()} />
        </div>
        { filters.map((filter) => (
          <select
            key={filter.name}
            name={filter.name}
            className={classes.filter}
            onChange={() => form.current?.submit()}
            value={filter.value || ''}
          >
            { filter.options.map(option => (
              <option
                key={option.value}
                value={option.value}
              >{`${option.label} (${option.count})`}</option>
            ))}
          </select>
        ))}
      </filterFetcher.Form>
      <FilmPrintsList items={items} className={classes.screeningsList} />
    </Page>
  );
}
