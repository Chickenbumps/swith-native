import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split,
} from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setContext } from "@apollo/client/link/context";
import {
  getMainDefinition,
  offsetLimitPagination,
} from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";

export const isLoggedInVar = makeVar(false);
export const darkModeVar = makeVar(false);
export const tokenVar = makeVar<string | null>(null);

const TOKEN = "token";

export const logUserIn = async (token: any) => {
  await AsyncStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
  tokenVar(token);
};
export const logUserOut = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN);
    client.cache.reset();
    isLoggedInVar(false);
    tokenVar(null);
  } catch (e) {
    throw new Error(`Logout error:${e}`);
  }
};

const wsLink = new WebSocketLink({
  uri: "ws://243f-221-150-231-140.ngrok.io/graphql",
  options: {
    reconnect: true,
    connectionParams: () => ({
      token: tokenVar(),
    }),
  },
});

const httpLink = createHttpLink({
  uri: "http://243f-221-150-231-140.ngrok.io/graphql",
});

const authLink = setContext((request, prevContext) => {
  return {
    headers: {
      ...prevContext.headers,
      token: tokenVar(),
    },
  };
});

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        seeComments: offsetLimitPagination(),
      },
    },
    Group: {
      fields: {
        messages: {
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
      },
    },
  },
});
const concatHttpLink = authLink.concat(httpLink);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  concatHttpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: cache,
});

export default client;
