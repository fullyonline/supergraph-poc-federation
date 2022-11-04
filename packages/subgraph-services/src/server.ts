import { printSubgraphSchema } from '@apollo/subgraph';
import { createServer } from '@graphql-yoga/node';
import { writeFileSync } from 'fs';
import { lexicographicSortSchema } from 'graphql';
import { schema } from './gqlSchema';

const schemaAsString = printSubgraphSchema(lexicographicSortSchema(schema));
writeFileSync('schema.graphql', schemaAsString);

const server = createServer({
  schema: schema,
  port: 4100,
  maskedErrors: false
});

server.logger.info('Starting GraphQL-Yoga Server for subgraph-services')
server.start();