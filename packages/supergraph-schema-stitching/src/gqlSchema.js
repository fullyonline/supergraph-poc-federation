import { introspectSchema } from '@graphql-tools/wrap'
import { makeRemoteExecutor } from "./make_remote_executor.js";
import { stitchSchemas } from '@graphql-tools/stitch';

const patientGraphqlUrl = 'http://127.0.0.1:4000/';
const casesGraphqlUrl = 'http://127.0.0.1:4200/graphql';
const servicesGraphqlUrl = 'http://127.0.0.1:4100/graphql';

export const patientsSubschema = {
        schema: await introspectSchema(makeRemoteExecutor(patientGraphqlUrl)),
        executor: makeRemoteExecutor(patientGraphqlUrl)
}

export const casesSubschema = {
    schema: await introspectSchema(makeRemoteExecutor(casesGraphqlUrl)),
    executor: makeRemoteExecutor(casesGraphqlUrl)
}

export const servicesSubschema = {
    schema: await introspectSchema(makeRemoteExecutor(servicesGraphqlUrl)),
    executor: makeRemoteExecutor(servicesGraphqlUrl)
}

export const gatewaySchema = stitchSchemas({
    subschemas: [patientsSubschema, casesSubschema, servicesSubschema],
    mergeTypes: true, // << default in v7
    typeDefs: 'type Query { heartbeat: String! }',
    resolvers: {
        Query: {
            heartbeat: () => 'OK'
        }
    }
});

