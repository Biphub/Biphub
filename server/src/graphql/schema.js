import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql'

import {PipelineList, Pipeline} from './types/Pipeline.type'
import {PodList} from './types/Pod.type'
import {ActionList} from './types/Action.type'
import {PodAuthList} from './types/PodAuth.type'

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields: {
    host: {
      type: GraphQLString,
      resolve(x, y, req) {
        return req.protocol + '://' + req.get('host')
      }
    },
    pipeline: Pipeline,
    allPipelines: PipelineList,
    allPods: PodList,
    allPodAuths: PodAuthList,
    allActions: ActionList
  }
})

const Schema = new GraphQLSchema({
  query: Query
})

export default Schema
