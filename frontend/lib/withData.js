import withApollo from 'next-with-apollo';  // high-order component that exposes the ApolloClient with a prop
import ApolloClient from 'apollo-boost';  // Apollo Boost: extensions for Apollo
import { endpoint } from '../config';

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include',
        },
        headers,
      });
    },
  });
}

export default withApollo(createClient);
