import { type LoaderFunctionArgs } from "@remix-run/node";
import type { Event } from "payload/generated-types";
import { generateEventICS } from "~/util/ics/generateEventICS";

export const loader = async ({
  params,
  context: { payload },
}: LoaderFunctionArgs) => {
  const id = params.id as string;

  let event: Event;
  try {
    event = await payload.findByID({
      collection: "events",
      id,
    });
  } catch (error) {
    return new Response("Event not found", { status: 404 });
  }

  try {
    const ics = generateEventICS(event);

    return new Response(ics, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `inline; filename=${event.title}.ics`,
      },
    });
  } catch (error) {
    return new Response("Error generating ICS file", { status: 500 });
  }
};
