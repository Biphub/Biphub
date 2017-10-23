import { logger } from '../../logger'
import * as R from 'ramda'
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList
} from 'graphql'
import * as GraphQLJSON from 'graphql-type-json'
import * as Sequelize from 'sequelize'
import { findPodsWithNames } from '../../DAO/pod.dao'
import { flattenSequence } from '../../DAO/pipeline.dao'
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
      },
      entryApp: {
        type: GraphQLString,
        resolve: x => x.get('entryApp')
      },
      entryType: {
        type: GraphQLString,
        resolve: x => x.get('entryType')
      },
      sequence: {
        type: GraphQLJSON,
        resolve: x => x.get('sequence')
      },
      flattenSequence: {
        type: GraphQLJSON,
        resolve: (x) => new Promise((res, rej) => {
          const getNames = R.compose(
            R.map(z => z.podName),
            flattenSequence
          )
          console.log('checking names ', getNames(x.get('sequence')))
          findPodsWithNames(
            getNames(x.get('sequence'))
          )
            .fork(
              (err) => rej(err),
              (z) => {
                console.log('checking')
                console.log(z)
                res(z)
              }
            )
        })
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
