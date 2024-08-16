import type { Screening, Site, StaticPage } from "payload/generated-types";
import EventsList from "../EventsList";
import { useRouteLoaderData } from "@remix-run/react";
import type { loader as rootLoader } from "~/root";
import environment from "~/util/environment";
import { useEffect, useState } from "react";
import qs from "qs";
import { useTranslation } from "react-i18next";

type EventsBlockProps = Extract<
  NonNullable<StaticPage["layout"]["blocks"][0]>,
  { blockType: "screenings" }
>;

const EventsBlock: React.FC<EventsBlockProps> = ({
  type,
  screeningSeries,
  screenings,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState<Screening[]>([]);
  const site = useRouteLoaderData<typeof rootLoader>("root")?.site as Site;

  // fetch screenings
  useEffect(() => {
    (async () => {
      let ids: string[] = [];
      let deepDocs: Screening[] = [];
      switch (type) {
        case "manual":
          ids =
            screenings
              ?.map((screening) =>
                typeof screening.doc === "string"
                  ? screening.doc
                  : screening.doc?.id
              )
              .filter(Boolean) ?? [];

          break;
        case "screeningSeries":
          const query = qs.stringify({
            depth: 0,
            where: {
              and: [
                {
                  _status: {
                    equals: "published",
                  },
                },
                {
                  series: {
                    equals:
                      typeof screeningSeries === "string"
                        ? screeningSeries
                        : screeningSeries?.id,
                  },
                },
              ],
            },
            sort: "date",
          });
          const res = await fetch(
            `${
              environment().PAYLOAD_PUBLIC_SERVER_URL || ""
            }/api/screenings?${query}`
          );
          const data = await res.json();
          ids = data.docs.map((doc: Screening) => doc.id);
          break;
      }

      await Promise.all(
        ids.map(async (id, index) => {
          return fetch(
            `${
              environment().PAYLOAD_PUBLIC_SERVER_URL || ""
            }/api/screenings/${id}?depth=3`
          )
            .then((res) => res.json())
            .then((data) => {
              deepDocs[index] = data;
            });
        })
      );

      setDocs(deepDocs);
      setLoading(false);
    })();
  }, [type, screenings, screeningSeries]);

  return loading ? (
    <p>{t("Loading...")}</p>
  ) : (
    <EventsList items={docs} site={site} />
  );
};

export default EventsBlock;
