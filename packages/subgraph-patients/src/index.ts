import { server } from './server'

server.listen().then(({ url }) => {
  console.log(`💫 Starting Apollo GraphQL Server for subgraph-patients`)
  console.log(`🚀 Server ready at ${url}`)
})