# Kino im Blauen Salon

Web application to administer the cinema program and film archive of the [Kino im Blauen
Salon](https://kinoimblauensalon.de/).  
Powered by [Remix](https://remix.run) and [PayloadCMS](https://payloadcms.com).

## Development

install the dependencies and generate the types:

```sh
pnpm i
pnpm generate:types
```

Start the app in the dev environment:

```sh
pnpm dev
```

OR:

```sh
docker compose up -d
```

## Production

First, build your app for production:

```sh
pnpm build
```

Then run the app in production mode:

```sh
pnpm start
```

### Fly.io Setup

1. Create an account on [Fly.io](https://fly.io)
1. Install the [Fly CLI](https://fly.io/docs/getting-started/installing-flyctl/)
1. Run `flyctl login` and follow the prompts
1. Run `flyctl launch` in the project root
1. Enter `y` to `copy its configuration to the new app`
1. Enter `N` to `tweak these settings`
1. The app should deploy now
1. Now you can set up the Github Action

### Github Action

1. Create a deploy token by running `flyctl tokens create deploy`
1. Create a new secret on your repository called `FLY_API_TOKEN` with your deploy token at `Settings > Secrets and Variables > Actions`

## Media Files

Media files should be stored in a S3 bucket. Create a bucket at Cloudflare, AWS, or any other provider and fill the required environment variables in the .env file. When using Cloudflare R2, specify `S3_REGION=auto`

## Migration

### Seed

To seed the database, run the following command in the docker container of the app:

```sh
pnpm seed
# in development use pnpm seed:dev
```

It will exexute the script `cms/seed/index.ts` which does:

- fill the countries collection with data from the restcountries.com api

### Apply Database Migrations

To apply database migrations, run the following command in the docker container of the app:

```sh
pnpm payload migrate

# development:
pnpm payload:dev migrate

# migrate down:
pnpm payload migrate:down
```

#### Dev: Create a new Migration

```sh
pnpm payload:dev migrate:create <name>
```

#### Regenerate Image Sizes

If you need to generate the image sizes again, you can do that with the following command:

```sh
pnpm generate:images
```

Make sure you have an `.env` file with `PAYLOAD_SECRET` and `MONGO_URL` defined.  
If you are using docker, just call the command inside the apps docker container.
