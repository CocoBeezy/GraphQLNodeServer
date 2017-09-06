const express = require('express');
const expressGraphQL = require('express-graphql');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const initializeDb = require('./db');
const config = require('./config');
const middleware = require('./middleware');
const schema = require('./schemas');

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
