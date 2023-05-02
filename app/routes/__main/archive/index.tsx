import type { ActionFunction, LoaderArgs } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { Page } from "~/components/Page";
import { FilmPrintsList } from "~/components/FilmPrintsList";
import classes from "./index.module.css";
import i18next from "~/i18next.server";
import { useTranslation } from "react-i18next";
import { Form } from "~/components/Form";
import Button from "~/components/Button";
import type { Payload } from "payload";
import type { Where } from "payload/types";
import type { FilmPrint, Movie } from "payload/generated-types";

type Filter = {
  value: any
  count: number
  label?: string
}
type Filters = {
  director?: Filter[]
  decade?: Filter[]
}

export const loader = async ({ request, params, context: { payload }}: LoaderArgs) => {
  const locale = await i18next.getLocale(request);
  const page = await payload.findGlobal({
    slug: 'archive',
    locale,
  });
  
  // get all published film prints
  const filmPrints = await payload.find({
    collection: 'filmPrints',
    locale,
    depth: 7,
    where: await getWhere(request),
  });
  
  // compute decades
  
  return {
    page,
    items: filmPrints.docs || [],
    filters: await getFilters(payload, request),
  }
};

export const action: ActionFunction = async ({ request, context: { payload }}) => {
  const locale = await i18next.getLocale(request);
  const filmPrints = await payload.find({
    collection: 'filmPrints',
    locale,
    depth: 7,
    where: await getWhere(request),
  });
  
  return {
    items: filmPrints.docs || [],
    filters: await getFilters(payload, request),
  }
}

/**
 * build where clause for filtering from form data
 */
const getWhere = async (request: globalThis.Request, extraWhere?: Where) => {
  let data: FormData | null = null;
  try {
    data = await request.formData();
  } catch {}

  const res: Where = {
    and: [
      {
        _status: {
          equals: 'published',
        },
      },
    ],
  }

  if (extraWhere) res.and?.push(extraWhere);

  if (data && data.get('filter_isHfgProduction')) {
    res.and?.push({
      'movie.isHfgProduction': {
        equals: true,
      },
    });
  }

  if (data && data.get('filter_exclude_isHfgProduction')) {
    res.and?.push({
      'movie.isHfgProduction': {
        equals: false,
      },
    });
  }
  
  return res;
}

/**
 * count how many items would remain after filtering with another where clause
 */
export const countWithFilter = async (payload: Payload, request: globalThis.Request, extraWhere: Where) => {
  console.log('countWithFilter', JSON.stringify(await getWhere(request, extraWhere)));
  const res = await payload.find({
    collection: 'filmPrints',
    where: await getWhere(request, extraWhere),
    depth: 3,
  });
  return res.totalDocs
}

/**
 * helper function to get all decades with their total number of items
 */
const getFilters = async (payload: Payload, request: globalThis.Request): Promise<Filters> => {
  // directors
  const persons = await payload.find({
    collection: 'persons',
    depth: 1,
  });
  const director: Filter[] = []; 
  for (const doc of persons.docs) {
    console.log('doc', doc);
    director.push({
      count: await countWithFilter(payload, request, {
        'movie.director': {
          // equals: doc.id,
        },
      }),
      value: doc.id,
      label: doc.name,
    });
  }

  // decades
  // get film prints with the oldest and youngest movie
  const oldest = await payload.find({
    collection: 'filmPrints',
    where: await getWhere(request),
    sort: 'movie.year',
    limit: 1,
  });
  const youngest = await payload.find({
    collection: 'filmPrints',
    where: await getWhere(request),
    sort: '-movie.year',
    limit: 1,
  });
  const decade: Filter[] = [];
  const firstYear = (oldest.docs[0].movie as Movie)?.year;
  const lastYear = (youngest.docs[0].movie as Movie)?.year;
  for (let year = firstYear - (firstYear % 10); year <= lastYear - (lastYear % 10); year += 10) {
    decade.push({
      count: await countWithFilter(payload, request, {
        'movie.year': {
          greater_than_equal: year,
          less_than: year + 10,
        },
      }),
      value: year,
    });
  }
  return {
    decade,
    director,
  }
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { page } = loaderData;
  const data: { items: FilmPrint[], filters: Filters} = actionData || loaderData;
  const { items, filters } = data;
  const { t } = useTranslation();

  return (
    <Page layout={page.layout}>
      <Form method="POST" className={classes.search}>
        <input
          type="search"
          name="search"
          placeholder={t('search...') || ''}
        />
        <input
          type="checkbox"
          name="filter_isHfgProduction"
          aria-label={t('show HfG productions only') || ''}
        />
        <input
          type="checkbox"
          name="filter_exclude_isHfgProduction"
          aria-label={`${t('exclude HfG productions')} (${'jj'})`}
        />
        <select
          name="filter_genre"
          aria-label={t('genre') || ''}
        >
          { filters.decade?.map(decade => (
            <option
              key={decade.value}
              value={decade.value}
            >{`${decade.value}s (${decade.count})`}</option>
          ))}
        </select>
        <select
          name="filter_decade"
          aria-label={t('director') || ''}
        >
          { filters.director?.map(item => (
            <option
              key={item.value}
              value={item.value}
            >{`${item.label} (${item.count})`}</option>
          ))}
        </select>
          
        <Button
          type="submit"
        >
          {t('submit')}
        </Button>
      </Form>
      <FilmPrintsList items={items} className={classes.screeningsList} />
    </Page>
  );
}
