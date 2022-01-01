import { createServer } from "http";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
const { prisma } = require("./prisma/client");

const startServer = async () => {
  const app = express();
  const httpServer = createServer(app);

  const typeDefs = gql`
    type Query {
      boards: [Board]
      tokensets: [TokenSet]
    }

    type Board {
      id: ID!
      title: String!
      description: String
      path: String!
    }

    type TokenSet {
      id: ID!
      author: String!
      protected: Boolean!
      title: String!
      description: String
    }
  `;

  const resolvers = {
    Query: {
      boards: () => {
        return prisma.board.findMany();
      },
      tokensets: () => {
        return prisma.tokenSet.findMany();
      },
    },
  };

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    path: "/api",
  });

  httpServer.listen({ port: process.env.PORT || 4000 }, () =>
    console.log(`Server listening on localhost:4000${apolloServer.graphqlPath}`)
  );
};

startServer();
