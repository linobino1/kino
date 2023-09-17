import type { MetaFunction, LoaderArgs} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import { Page } from "~/components/Page";
import { FilmPrintsList } from "~/components/FilmPrintsList";
import classes from "./index.module.css";
import i18next from "~/i18next.server";
import { useTranslation } from "react-i18next";
import type { Payload } from "payload";
import { Filters } from "~/util/filter";
import { useRef } from "react";
import type { Where } from "payload/types";
import { pageDescription, pageKeywords, pageTitle } from "~/util/pageMeta";
import Pagination from "~/components/Pagination";

const limit = 10;

export const loader = async ({ request, context: { payload }}: LoaderArgs) => {
  const locale = await i18next.getLocale(request);
  const page = await payload.findGlobal({
    slug: 'archive',
    locale,
  });
  const params = new URL(request.url).searchParams;
  console.log('params', params)
  const pageNumber  = parseInt(params.get('page') || '1');
  const query = params.get('query') || '';
  
  // get all published film prints
  const filters = getFilters({
    payload,
    locale,
    params,
  });
  filters.applySearchParams(params);
  const filmPrints = await payload.find({
    collection: 'filmPrints',
    locale,
    depth: 7,
    limit,
    page: pageNumber,
    where: filters.getWhereClause(),
  });

  // Redirect to the last page if the requested page is greater than the total number of page
  if (pageNumber > filmPrints.totalPages) {
    throw redirect(`?page=${filmPrints.totalPages}`, {
      status: 302,
    });
  }
  
  return {
    page,
    query,
    filters: await filters.getApplied(),
    filmPrints,
  }
};

export const meta: MetaFunction<typeof loader> = ({ data, parentsData }) => ({
  title: pageTitle(parentsData.root?.site?.meta?.title, data?.page?.meta?.title),
  description: pageDescription(parentsData.root?.site?.meta?.description, data?.page?.meta?.description),
  keywords: pageKeywords(parentsData.root?.site?.meta?.keywords, data?.page?.meta?.keywords),
});

const getFilters = ({payload, locale, params} : {
  payload: Payload,
  locale: string,
  params?: URLSearchParams,
}): Filters => {
  const query = params && params.get('query');
  const queryClause: Where | undefined = query ? {
    or: [
      {
        'movie.internationalTitle': {
          contains: query,
        },
      },
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
        'movie.crew.person.name': {
          contains: query,
        },
      },
      {
        'movie.synopsis': {
          contains: query,
        },
      },
      {
        'movie.tags': {
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
      {
        _status: {
          equals: 'published',
        },
      },
      queryClause || {},
    ],
  };
  const filters = new Filters({
    collection: 'filmPrints',
    payload,
    locale,
    filters: [
      {
        name: 'languageVersion.name',
        label: 'filter.languageVersion',
      },
      {
        name: 'format.name',
        label: 'filter.format',
      },
      {
        name: 'movie.genres.name',
        label: 'filter.genre',
      },
      {
        name: 'color.name',
        label: 'filter.color',
      },
      {
        name: 'movie.countries.id',
        label: 'filter.countries',
      },
      {
        name: 'movie.decade',
        label: 'filter.decade',
        type: 'number',
        where: (value: any) => ((typeof value === 'number') ? {
          and: [
            {
              'movie.year': {
                greater_than_equal: value,
              },
            },
            {
              'movie.year': {
                less_than: value + 10,
              },
            },
          ],
        } : {
          and: [],
        }),
      },
      {
        name: 'movie.isHfgProduction',
        label: 'filter.isHfgProduction',
        labelTrue: 'filter.isHfgProduction.true',
        labelFalse: 'filter.isHfgProduction.false',
      },
      {
        name: 'movie.directors.name',
        label: 'filter.directors',
      },
    ],
    globalCause,
  });
  filters.applySearchParams(params);
  return filters;
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const { page } = data;
  const { filmPrints, filters, query } = data;
  const { t } = useTranslation();
  const form = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const [ params ] = useSearchParams();
  
  const resetFilters = () => {
    filters.forEach(filter => {
      params.delete(filter.name);
    });
    params.delete('page');
    navigate(`?${params.toString()}`)
  }

  return (
    <Page layout={page.layout}>
      <Form
        ref={form}
        method="GET"
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
              >{`${t(option.label || '')} (${option.count})`}</option>
            ))}
          </select>
        ))}
        <button
          type="button"
          className={classes.reset}
          onClick={resetFilters}
        >{t('reset filters')}</button>
      </Form>
      <FilmPrintsList
        items={filmPrints.docs || []}
        className={classes.list}
      />
      <Pagination {...filmPrints} linkProps={{ prefetch: 'intent' }}/>
    </Page>
  );
}
