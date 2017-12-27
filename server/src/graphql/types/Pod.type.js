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
      },
      icon: {
        type: GraphQLString,
        resolve: x => x.get('icon')
      },
      stage: {
        type: GraphQLString,
        resolve: x => x.get('stage')
      },
      styles: {
        type: GraphQLJSON,
        resolve: x => x.get('styles')
      },
      actions: {
        type: new GraphQLList(ActionType),
        resolve: x => x.get('Actions')
      }
    }
  }
})

export const PodList = {
  type: new GraphQLList(PodType),
  args: {
    id: {
      type: GraphQLInt
    }
  },
  resolve(root, args) {
    const id = R.prop('id', args)
    const newArgs = merge(args, {
      include: [models.Action]
    })
    if (id) {
      const argsWithId = merge(newArgs, {
        where: {
          id: id
        }
      })
      return models.Pod.findAll(argsWithId)
    }
    return models.Pod.findAll(newArgs)
  }
}
