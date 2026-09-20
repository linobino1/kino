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

Both apps run on k3s. Pushes to `main` build arm64 images, publish them to the
private Forgejo registry, apply the manifests in `k8s/`, and wait for both
Deployment rollouts.

Non-sensitive runtime variables are committed in `k8s/configmap.yaml`.
Production secrets are encrypted with [SOPS](https://github.com/getsops/sops)
and age in `secrets/*.enc.env`. Install SOPS and configure `SOPS_AGE_KEY_FILE`
with the age private key matching the recipient in `.sops.yaml`.

Edit the encrypted file in place and commit the encrypted result:

```sh
sops secrets/prod.enc.env
```

`secrets/prod.enc.env` must contain:

```dotenv
DATABASE_URI=...
PAYLOAD_SECRET=...
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
TURNSTILE_SECRET_KEY=...
LISTMONK_API_KEY=...
```

Create or update the Secrets before the first deployment or after changing
their values:

```bash
export KUBECONFIG=../infra/k3s-cluster/kubeconfig
kubectl apply -f k8s/namespace.yaml
sops --decrypt secrets/prod.enc.env | kubectl create secret generic kino-secrets -n kino-im-blauen-salon --from-env-file=/dev/stdin --dry-run=client -o yaml | kubectl apply -f -
kubectl rollout restart deployment/kino-backend -n kino-im-blauen-salon
kubectl rollout restart deployment/kino-frontend -n kino-im-blauen-salon
```

The Forgejo repository needs `KUBECONFIG`, `REGISTRY_WRITE_TOKEN`, and
`REGISTRY_READ_TOKEN` Actions secrets. The deployment workflow does not decrypt
the committed SOPS file. These secrets may be defined at the user level instead
of the repository level.

After changing the ConfigMap, apply it and restart both Deployments:

```bash
kubectl apply -f k8s/configmap.yaml
kubectl rollout restart deployment/kino-backend deployment/kino-frontend -n kino-im-blauen-salon
```

## Listmonk Integration

The mailings collection is integrated with the [Listmonk](https://listmonk.app/) installation. To set it up, install listmonk, create a list for your subscribers and set up an API user in the listmonk admin panel with the following `campaigns:manage` permission.
Populate your `.env` with:

- `LISTMONK_URL`: the root URL of your listmonk installation, e.g. `https://listmonk.example.com`
- `LISTMONK_API_KEY`: consists of the API user's name and token, e.g. `api-user:api-token`
- `LISTMONK_LIST_ID`: the ID of your subscribers list

For your frontend's signup form, you will also need:

- `LISTMONK_LIST_UUID`: the UUID of your subscribers list
