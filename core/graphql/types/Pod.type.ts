import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList
} from 'graphql'

import { default as models } from '../../models'

export const PodType = new GraphQLObjectType({
  name: 'Pod',
  description: 'Pod represents external APIs or tools that are connected to the hub',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve: x => x.get('id')
      },
      name: {
        type: GraphQLString,
        resolve: x => x.get('name')
      },
      title: {
        type: GraphQLString,
        resolve: x => x.get('title')
      },
      description: {
        type: GraphQLString,
        resolve: x => x.get('description')
      },
      url: {
        type: GraphQLString,
        resolve: x => x.get('url')
      }
    }
  }
})

export const PodList = {
  type: new GraphQLList(PodType),
  args: {
    test: {
      type: GraphQLInt
    }
  },
  resolve(root, args) {
    return models.Pod.findAll(args)
  }
}
