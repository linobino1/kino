FROM node:18 as base

ARG NODE_ENV
ARG PAYLOAD_PUBLIC_SERVER_URL
ARG HCAPTCHA_SITE_KEY

ENV NODE_ENV=${NODE_ENV}
ENV PAYLOAD_PUBLIC_SERVER_URL=${PAYLOAD_PUBLIC_SERVER_URL}
ENV HCAPTCHA_SITE_KEY=${HCAPTCHA_SITE_KEY}

FROM base as builder

WORKDIR /home/node
COPY package*.json ./

COPY . .
RUN yarn install
RUN yarn build

FROM base as runtime

ENV NODE_ENV=production

WORKDIR /home/node
COPY package*.json  ./

RUN yarn install --production
COPY --from=builder /home/node/dist ./dist
COPY --from=builder /home/node/build ./build
COPY --from=builder /home/node/public ./public

EXPOSE 3000

CMD ["yarn", "start"]