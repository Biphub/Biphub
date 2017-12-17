import R from 'ramda'
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLID
} from 'graphql'
import GraphQLJSON from 'graphql-type-json'
import {findPodsWithNames} from '../../DAO/pod.dao'
import {flattenSequence} from '../../DAO/pipeline.dao'
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
    }
  }
})

export const ActionList = {
  type: new GraphQLList(ActionList),
  args: {
    test: {
      type: GraphQLInt
    }
  },
  resolve(root, args) {
    return models.Pipeline.findAll(args)
  }
}
