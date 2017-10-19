import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql'

import { PipelineList } from './types/Pipeline.type'

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields: {
    hello: {
      type: GraphQLString,
      resolve() {
        return 'test test';
      }
    },
    allPipelines: PipelineList
  }
})

const Schema = new GraphQLSchema({
  query: Query
})

export default Schema
