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
        resolve: (pipeline) => {
          return pipeline.get('id')
        }
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
