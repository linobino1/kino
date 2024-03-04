# Kino im Blauen Salon

Web application to administer the cinema program and film archive of the [Kino im Blauen
Salon](https://kinoimblauensalon.de/).  
Powered by [Remix](https://remix.run) and [PayloadCMS](https://payloadcms.com).

## Development

install the dependencies and generate the types:

```sh
yarn
yarn generate:types
```

Start the app in the dev environment:

```sh
yarn dev
```

OR:

```sh
docker compose up -d
```

## Production

First, build your app for production:

```sh
yarn build
```

Then run the app in production mode:

```sh
yarn start
```

## Migration

### Seed

To seed the database, run the following command in the docker container of the app:

```sh
yarn seed
# in development use yarn seed:dev
```

It will exexute the script `cms/seed/index.ts` which does:

- fill the countries collection with data from the restcountries.com api

### Apply Database Migrations

To apply database migrations, run the following command in the docker container of the app:

```sh
yarn payload migrate

# development:
yarn payload:dev migrate

# migrate down:
yarn payload migrate:down
```

#### Dev: Create a new Migration

```sh
yarn payload:dev migrate:create <name>
```

#### Regenerate Image Sizes

If you need to generate the image sizes again, you can do that with the following command:

```sh
yarn generate:images
```

Make sure you have an `.env` file with `PAYLOAD_SECRET` and `MONGO_URL` defined.  
If you are using docker, just call the command inside the apps docker container.
