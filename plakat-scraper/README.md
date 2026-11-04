# Plakat availability scraper

Checks the published Google Sheet for green cells every 30 minutes and emails
when availability first appears. It resets the alert state after no green cells
are found.

Run locally with Deno 2:

```sh
deno task start
```

The scraper runs as the `plakat-scraper` Kubernetes CronJob every 30 minutes.
The Forgejo deploy workflow builds and deploys its image with the other apps.
Configure `ZEPTOMAIL_API_KEY` in the `kino-secrets` Kubernetes Secret. The
sender and recipient addresses are in `mailer.ts`; the sender must be verified
with ZeptoMail.

The sent-alert state is stored as `plakat-scraper/state.json` in the bucket
configured by `PLAKAT_SCRAPER_STATE_BUCKET`. It uses the existing S3-compatible
R2 endpoint and credentials from `kino-env` / `kino-secrets`, so no PVC is
needed and the state survives replacement of the k3s node. The state is only a
boolean; for tighter isolation, point it at a private bucket and use credentials
scoped to that bucket.

Set `PLAKAT_SCRAPER_ALERTMANAGER_URL` in `k8s/configmap.yaml` to an Alertmanager
URL reachable from a pod (the Alertmanager API must be enabled). Failed runs
post a `PlakatScraperFailed` alert to `/api/v2/alerts`; a successful run resolves
it. Configure an Alertmanager route/receiver for that alert name. If unset, the
CronJob still reports failures through its Kubernetes Job status and logs, but
does not send an Alertmanager alert.
