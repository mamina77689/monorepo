import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";


const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4001' }),
  cache: new InMemoryCache(),
});

