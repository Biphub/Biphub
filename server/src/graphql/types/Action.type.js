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
      },
      trigger: {
        type: GraphQLString,
        resolve: x => x.get('trigger')
      }
    }
  }
})

export const ActionList = {
  type: new GraphQLList(ActionType),
  args: {
    podId: {
      type: GraphQLInt
    }
  },
  resolve(root, args) {
    const podId = R.prop('podId', args)
    // If podId is specified, search of that one
    if (podId) {
      return models.Action.findAll({
        where: {
          podId: args.podId
        }
      })
    }
    // Otherwise return full
    return models.Action.findAll()
  }
}
