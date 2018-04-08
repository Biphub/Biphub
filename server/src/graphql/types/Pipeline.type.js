import { logger } from '../../logger'
import R from 'ramda'
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLID,
} from 'graphql'
import GraphQLJSON from 'graphql-type-json'
import { findPodsWithNames } from '../../DAO/pod.dao'
import { flattenSequence } from '../../DAO/pipeline.dao'
import { models } from '../../models'

export const PipelineType = new GraphQLObjectType({
  name: 'Pipeline',
  description: 'Pipeline represents ochestration of tasks',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve: x => x.get('id'),
      },
      title: {
        type: GraphQLString,
        resolve: x => x.get('title'),
      },
      description: {
        type: GraphQLString,
        resolve: x => x.get('description'),
      },
      entryApp: {
        type: GraphQLString,
        resolve: x => x.get('entryApp'),
      },
      entryType: {
        type: GraphQLString,
        resolve: x => x.get('entryType'),
      },
      sequence: {
        type: GraphQLJSON,
        resolve: x => x.get('sequence'),
      },
      nodes: {
        type: GraphQLJSON,
        resolve: x =>
          new Promise((res, rej) => {
            const nodes = x.get('nodes')
            // Get unique
            const uniqueNames = R.compose(
              R.map(R.last),
              R.map(R.split('-')),
              R.uniq,
              R.map(x => x.podName),
            )(nodes)
            findPodsWithNames(uniqueNames).fork(rej, pods => {
              // ORM found pods as json values
              const values = R.map(x => x.toJSON(), pods)
              // Loop each nodes and find icon of each node
              const newPods = R.map(n => {
                const podName = R.compose(R.last, R.split('-'))(n.podName)
                const icon = R.compose(
                  R.prop('icon'),
                  R.find(R.propEq('name', podName)),
                )(values)
                return R.assoc('icon', icon, n)
              }, nodes)
              res(newPods)
            })
          }),
      },
      edges: {
        type: GraphQLJSON,
      },
      // Flatten sequence (aka list of pods required to run this pipeline)
      flattenSequence: {
        type: GraphQLJSON,
        resolve: x =>
          new Promise((res, rej) => {
            // Get pods from flat sequence
            const getNames = R.compose(
              R.map(R.last),
              R.map(R.split('-')),
              R.uniq,
              R.map(z => z.podName),
              flattenSequence,
            )
            const names = getNames(x.get('sequence'))
            console.log('got names ', names)
            if (!names) {
              rej(new Error('Name is invalid!'))
            }
            findPodsWithNames(names).fork(rej, res)
          }),
      },
    }
  },
})

export const Pipeline = {
  type: PipelineType,
  args: {
    id: {
      type: GraphQLID,
    },
  },
  resolve(root, args) {
    return models.Pipeline.find(args)
  },
}

export const PipelineList = {
  type: new GraphQLList(PipelineType),
  args: {
    test: {
      type: GraphQLInt,
    },
  },
  resolve(root, args) {
    return models.Pipeline.findAll(args)
  },
}
