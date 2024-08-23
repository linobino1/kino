import { Client, cacheExchange, fetchExchange } from "@urql/core";

const endpoint = "https://alt.kinoimblauensalon.de/graphql";

export const gqlClient = new Client({
  url: endpoint,
  exchanges: [cacheExchange, fetchExchange],
});
