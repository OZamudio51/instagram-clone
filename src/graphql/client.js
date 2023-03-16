import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";

const headers = {"x-hasura-admin-secret": "ZXT0pD6VAzTSFvostnZnrCTT6KAa1VeX6utME0EG51uMUNwJ10yAkqrdoBKu91mB"};

const client = new ApolloClient({
    link: new WebSocketLink({
        uri: "wss://expert-mammoth-86.hasura.app/v1/graphql",
        options: {
            reconnect: true,
            connectionParams: {
                headers
            }
        }
    }),
    cache: new InMemoryCache()
})

export default client;