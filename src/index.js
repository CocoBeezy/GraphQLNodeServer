import express from 'express';
import expressGraphQL from 'express-graphql';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import initializeDb from './db';
import config from './config';
import middleware from './middleware';
import schema from './schemas';

const graphQLServer = express();

graphQLServer.use(cors());
graphQLServer.use(morgan('combined'));



initializeDb(db => {
  graphQLServer.use(middleware({ config, db }));

  graphQLServer.use('/graphql', bodyParser.json(), expressGraphQL({
    schema,
    context: {},
    graphiql: true,
    pretty: true,
  }));

  graphQLServer.listen(config.port, () => {
    console.log(`GraphQL Server is now running on http://localhost:${config.port}/graphql`);
  });
});
