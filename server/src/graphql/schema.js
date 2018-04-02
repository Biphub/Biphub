import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList } from 'graphql'
import { PipelineList, Pipeline, PipelineType } from './types/Pipeline.type'
import { PodList } from './types/Pod.type'
import { ActionList } from './types/Action.type'
import { PodAuthList } from './types/PodAuth.type'
import { CreatePipelineMutation } from './mutations/Pipeline.mutation'

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields: {
    host: {
      type: GraphQLString,
      resolve(x, y, req) {
        return req.protocol + '://' + req.get('host')
      },
    },
    pipeline: Pipeline,
    allPipelines: PipelineList,
    allPods: PodList,
    allPodAuths: PodAuthList,
    allActions: ActionList,
  },
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root mutation Object',
  fields: {
    createPipeline: CreatePipelineMutation
  }
})

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
})

export default Schema
