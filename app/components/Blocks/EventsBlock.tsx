import type { Event, Site, StaticPage } from "payload/generated-types";
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
  events,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState<Event[]>([]);
  const site = useRouteLoaderData<typeof rootLoader>("root")
    ?.site as unknown as Site;

  // fetch screenings
  useEffect(() => {
    (async () => {
      let ids: string[] = [];
      let deepDocs: Event[] = [];
      switch (type) {
        case "manual":
          ids =
            events
              ?.map((event: any) =>
                typeof event.doc === "string" ? event.doc : event.doc?.id
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
            }/api/events?${query}`
          );
          const data = await res.json();
          ids = data.docs.map((doc: Event) => doc.id);
          break;
      }

      await Promise.all(
        ids.map(async (id, index) => {
          return fetch(
            `${
              environment().PAYLOAD_PUBLIC_SERVER_URL || ""
            }/api/events/${id}?depth=3`
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
  }, [type, events, screeningSeries]);

  return loading ? (
    <p>{t("Loading...")}</p>
  ) : (
    <EventsList items={docs} site={site} />
  );
};

export default EventsBlock;
