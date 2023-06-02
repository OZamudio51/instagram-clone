import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";

const token = process.env.REACT_APP_HASURA_SECRET;
const url = process.env.REACT_APP_HASURA_URL;

const headers = {"x-hasura-admin-secret": `${token}`};

const client = new ApolloClient({
    link: new WebSocketLink({
        uri: `${url}`,
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