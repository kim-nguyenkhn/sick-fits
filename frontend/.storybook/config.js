import { configure, addDecorator } from "@storybook/react";
import apolloStorybookDecorator from "apollo-storybook-react";

const typeDefs = `
  type Query {
    helloWorld: String
  }

  schema {
    query: Query
  }
`;

const mocks = {
  Query: () => {
    return {
      helloWorld: () => {
        return "Hello from Apollo!!";
      }
    };
  }
};

// Wrap the storybook environment in an ApolloClient
addDecorator(
  apolloStorybookDecorator({
    typeDefs,
    mocks
  })
);

// automatically import all files ending in *.stories.js
const req = require.context("../stories", true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
