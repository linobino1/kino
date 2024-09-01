FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN pnpm install --prod --frozen-lockfile

FROM base AS build

RUN pnpm install --prod false --frozen-lockfile

# we'll need the sentry auth token to upload sourcemaps during the build
ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
ARG SENTRY_RELEASE
ENV SENTRY_RELEASE=${SENTRY_RELEASE}

# we need those certificates to be able to connect to sentry
RUN apt-get update && apt-get install -y ca-certificates

RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY --from=build /app/build /app/build

EXPOSE 3000
CMD [ "pnpm", "start" ]