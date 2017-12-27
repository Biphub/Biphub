import { merge } from 'ramda'
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList
} from 'graphql'
import GraphQLJSON from 'graphql-type-json'
import { ActionType } from './Action.type'

import {models} from '../../models'
import R from 'ramda'

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
  type: new GraphQLList(PodType),
  args: {
  },
  resolve(root, args) {
    return models.PodAuth.findAll()
  }
}