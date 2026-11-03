# Plakat availability scraper

Checks the published Google Sheet for green cells every 30 minutes and emails
when availability first appears. It resets the alert state after no green cells
are found.

Run locally with Deno 2:

```sh
deno task start
```

The Forgejo workflow is `.forgejo/workflows/scrape-plakatwalker.yaml`. Configure
the repository secret `PLAKAT_SCRAPER_ZEPTOMAIL_API_KEY` with a ZeptoMail API
key. The sender and recipient addresses are configured in `mailer.ts`; the
sender address must be verified with ZeptoMail.

The workflow cache carries `.state.json` between runs; the Forgejo runner's
cache must be enabled and retained to avoid losing the alert state. A missing
state file is treated as `false` (no available cells), so the first run sends an
email if availability is present and saves the current state for subsequent runs.
