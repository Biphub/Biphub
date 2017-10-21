import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList
} from 'graphql'

import { default as models } from '../../models'

export const PipelineType = new GraphQLObjectType({
  name: 'Pipeline',
  description: 'Pipeline represents ochestration of tasks',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve: x => x.get('id')
      },
      title: {
        type: GraphQLString,
        resolve: x => x.get('title')
      },
      description: {
        type: GraphQLString,
        resolve: x => x.get('description')
      }
    }
  }
})

export const PipelineList = {
  type: new GraphQLList(PipelineType),
  args: {
    test: {
      type: GraphQLInt
    }
  },
  resolve(root, args) {
    return models.Pipeline.findAll(args)
  }
}