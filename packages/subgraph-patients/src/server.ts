import { ApolloServer } from 'apollo-server';
// import { schema } from './gqlSchema'
import { printSubgraphSchema } from '@apollo/subgraph';
import { writeFileSync } from 'fs';
import { lexicographicSortSchema } from 'graphql';
import { pothosSchema } from "./gqlSchemaPothos";

const schema = pothosSchema;
const schemaAsString = printSubgraphSchema(lexicographicSortSchema(schema));
writeFileSync('schema.graphql', schemaAsString);

// export const server = new ApolloServer({ schema }) // Nexus schema
export const server = new ApolloServer({ schema: pothosSchema }) // Pothos schema