import * as R from 'ramda'
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt
} from 'graphql'
import GraphQLJSON from 'graphql-type-json'
import {models} from '../../models'

export const PodAuth = new GraphQLObjectType({
  name: 'PodAuth',
  description: 'Authentication required for a pod',
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: (x) => x.get('id')
    },
    strategyType: {
      type: GraphQLString,
      resolve: (x) => x.get('strategyType')
    },
    properties: {
      type: GraphQLJSON,
      resolve: (x) => x.get('properties')
    }
  })
})

export const PodAuthList = {
  type: new GraphQLList(PodAuth),
  args: {
    podId: {
      type: GraphQLInt
    }
  },
  resolve(root, args) {
    const podId = R.prop('podId', args)
    if (podId) {
      return models.PodAuth.findAll({
        where: { podId }
      })
    }
    return models.PodAuth.findAll()
  }
}