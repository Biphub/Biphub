import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql'

import { PipelineList } from './types/Pipeline.type'
import { PodList } from './types/Pod.type'

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
    allPipelines: PipelineList,
    allPods: PodList
  }
})

const Schema = new GraphQLSchema({
  query: Query
})

export default Schema
