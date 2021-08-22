import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setContext } from "@apollo/client/link/context";
import { offsetLimitPagination } from "@apollo/client/utilities";
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

const httpLink = createHttpLink({
  uri: "http://cc23-221-150-231-140.ngrok.io/graphql",
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
  },
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: cache,
});

export default client;
