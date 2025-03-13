# kinoimblauensalon.de

Website for the cinema "Kino im Blauen Salon" in HfG Karlsruhe based on [Remix](https://remix.run) and [PayloadCMS](https://payloadcms.com). The website is showcasing future and past screening events. The CMS is used to manage the events, featuring an import function to import movie metadata from [TMDB](https://www.themoviedb.org).

## Features

- Showcase upcoming and past events
- Import movie metadata from TMDB
- HTML email newsletter generation
- PDF press release generation
- .ics calendar files for events

## Development

Make sure to create a `.env` file in the project root similar to the `.env.example` file. You will need a [TMDB API key](https://www.themoviedb.org/documentation/api) to fetch movie data and a [Listmonk](https://listmonk.app/) installation to manage your subscribers and send newsletters.  
The S3 configuration is optional, not needed for development.

```bash
pnpm i
pnpm dev
# frontend is running on localhost:5173
# cms is running on localhost:3000

# to seed the database (will fetch some movie data from TMDB, make sure you have your api key in the .env)
pnpm seed
```

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
