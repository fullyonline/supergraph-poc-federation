import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { lexicographicSortSchema } from 'graphql';
// import { schema }  from './gqlSchema.js';
import { printSubgraphSchema } from '@apollo/subgraph';
import { writeFileSync } from 'fs';
import { pothosSchema } from './pothosSchema';

const port = 4200
const path = '/graphql'
const schema = pothosSchema;

const schemaAsString = printSubgraphSchema(lexicographicSortSchema(schema));
writeFileSync('schema.graphql', schemaAsString);

var app = express()
app.use(
  path,
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  }),
)
app.listen(port)
console.log('🚄 Starting Express GraphQL Server for subgraph-cases')
console.log(`🚀 Server ready at http://localhost:${port}${path}`)
