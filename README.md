# kinoimblauensalon.de

Website for the cinema "Kino im Blauen Salon" in HfG Karlsruhe based on [Remix](https://remix.run) and [PayloadCMS](https://payloadcms.com). The website is showcasing future and past screening events. The CMS is used to manage the events, featuring an import function to import movie metadata from [TMDB](https://www.themoviedb.org) and a tool to generate an HTML newsletter for a set of events.

## Development

Make sure to populate the `.env` files in `/frontend` and `/cms` with a `DATABASE_URI` and `PAYLOAD_SECRET`.

```bash
pnpm i
pnpm dev
# frontend is running on localhost:5173
# cms is running on localhost:3000
```

There is no seeding data yet! This might make it a bit hard to get started.

## Deployment

The frontend is running on [vercel](https://vercel.com), the CMS on [fly.io](https://fly.io) using the Dockerfile in the project root.

## Listmonk Integration

The mailings collection is integrated with the [Listmonk](https://listmonk.app/) installation. To set it up, install listmonk, create a list for your subscribers and set up an API user in the listmonk admin panel with the following `campaigns:manage` permission.
Populate your `.env` with:

- `LISTMONK_URL`: the root URL of your listmonk installation, e.g. `https://listmonk.example.com`
- `LISTMONK_API_KEY`: consists of the API user's name and token, e.g. `api-user:api-token`
- `LISTMONK_LIST_ID`: the ID of your subscribers list

For your frontend's signup form, you will also need:

- `LISTMONK_LIST_UUID`: the UUID of your subscribers list
