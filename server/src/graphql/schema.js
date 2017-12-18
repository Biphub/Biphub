import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql'

import {PipelineList, Pipeline} from './types/Pipeline.type'
import {PodList} from './types/Pod.type'
import { ActionList } from './types/Action.type'

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields: {
    hello: {
      type: GraphQLString,
      resolve() {
        return 'test test'
      }
    },
    host: {
      type: GraphQLString,
      resolve(x, y, req) {
        return req.protocol + '://' + req.get('host')
      }
    },
    pipeline: Pipeline,
    allPipelines: PipelineList,
    allPods: PodList,
    allActions: ActionList,
  }
})

const Schema = new GraphQLSchema({
  query: Query
})

export default Schema
