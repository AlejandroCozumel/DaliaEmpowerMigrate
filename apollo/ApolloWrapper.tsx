'use client';

import { HttpLink, ApolloLink, from } from "@apollo/client";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";

// Define your endpoints
const PRIMARY_API = "https://api.daliaempower.com/graphql";
const SECONDARY_API = "https://apix.daliaempower.com/graphql";

function makeClient() {
  // Create separate HTTP links for each endpoint
  const primaryHttpLink = new HttpLink({
    uri: PRIMARY_API,
    fetchOptions: { cache: "no-store" },
  });

  const secondaryHttpLink = new HttpLink({
    uri: SECONDARY_API,
    fetchOptions: { cache: "no-store" },
  });

  // Auth middleware
  const authMiddleware = new ApolloLink((operation, forward) => {
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem("dalia.auth.login") || '';
    }

    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : "",
      }
    }));

    return forward(operation);
  });

  // Endpoint selection middleware
  const endpointMiddleware = new ApolloLink((operation, forward) => {
    const context = operation.getContext();
    const useSecondaryEndpoint = context.useSecondaryEndpoint;

    // Set the appropriate link based on the context
    operation.setContext({
      link: useSecondaryEndpoint ? secondaryHttpLink : primaryHttpLink
    });

    return forward(operation);
  });

  // Optional: Refresh Token Middleware
  const refreshTokenMiddleware = new ApolloLink((operation, forward) => {
    return forward(operation).map((response) => {
      const errors = response.errors;
      if (errors) {
        for (const error of errors) {
          if (error.extensions?.code === "UNAUTHENTICATED") {
            console.log("Token needs refresh");
          }
        }
      }
      return response;
    });
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: from([
      authMiddleware,
      refreshTokenMiddleware,
      endpointMiddleware,
      // The actual HTTP link will be selected by the endpoint middleware
      primaryHttpLink // This is the default link
    ]),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });
}

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}