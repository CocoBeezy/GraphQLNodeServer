import express from 'express';
import { apolloExpress, graphiqlExpress } from 'apollo-server';
import { makeExecutableSchema } from 'graphql-tools';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import initializeDb from './db';
import config from './config';
import middleware from './middleware';
import Schemas from './schemas/root-query';
import Resolvers from './resolvers/resolver-map';

const graphQLServer = express();

graphQLServer.use(cors());
graphQLServer.use(morgan('combined'));



initializeDb(db => {
  graphQLServer.use(middleware({ config, db }));

  const executableSchema = makeExecutableSchema({
    typeDefs: Schemas,
    resolvers: Resolvers,
    printErrors: true,
    allowUndefinedInResolve: true
  });

  graphQLServer.use('/graphql', bodyParser.json(), apolloExpress({
    schema: executableSchema,
    context: {},
    graphiql: true,
    pretty: true,
  }));

  graphQLServer.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql'
  }));

  graphQLServer.listen(config.port, () => {
    console.log(`GraphQL Server is now running on http://localhost:${config.port}/graphql`);
  });
});
