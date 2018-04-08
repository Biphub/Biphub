import { GraphQLString, GraphQLList } from 'graphql'
import GraphQLJSON from 'graphql-type-json'
import { PipelineType } from '../types/Pipeline.type'
import { create } from '../../DAO/pipeline.dao'

export const CreatePipelineMutation = {
  type: PipelineType,
  args: {
    title: {
      type: GraphQLString,
    },
    entryApp: {
      type: GraphQLString,
    },
    entryType: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    nodes: {
      type: GraphQLJSON,
    },
    edges: {
      type: GraphQLJSON,
    },
    dataMaps: {
      type: GraphQLJSON,
    },
  },
  resolve: (_, pipeline) => {
    return create(pipeline)
  },
}
