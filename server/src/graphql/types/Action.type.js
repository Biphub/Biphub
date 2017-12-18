import R from 'ramda'
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLID
} from 'graphql'
import GraphQLJSON from 'graphql-type-json'
import {models} from '../../models'

export const ActionType = new GraphQLObjectType({
  name: 'Action',
  description: 'Action supported by pod',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve: x => x.get('id')
      },
      title: {
        type: GraphQLString,
        resolve: x => x.get('title')
      }
    }
  }
})

export const ActionList = {
  type: new GraphQLList(ActionType),
  args: {
    test: {
      type: GraphQLInt
    }
  },
  resolve(root, args) {
    return models.Action.findAll(args)
  }
}
