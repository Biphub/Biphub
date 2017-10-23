import * as R from 'ramda'
import models from '../models'
import * as fluture from 'fluture'
import { PipelineModel, PipelineInstance } from '../models/Pipeline.model'
const Future = fluture.Future

/**
 * Creates a pipeline
 * @param {PipelineInstance} pipeline
 * @returns {any} // TODO Fix any type
 */
export function create (pipeline: PipelineInstance) {
  return fluture.Future((rej, res) => {
    models.Pipeline.create(pipeline)
      .then((value: PipelineModel) => res(value))
      .catch((e: Error) => rej(e))
  })
}

/**
 * Find all pipelines by entry app name.
 * @param {string} entryApp
 */
export const findAllPipelines = (entryApp: string) => Future((rej, res) => {
  models.Pipeline.findAll({
    where: {
      entryApp: entryApp
    }
  })
    .then((pipeline) => {
      res(pipeline)
    })
    .catch(e => rej(e))
})

/**
 * Current sequence can be edge or node
 * edge => "action1"
 * node => "podName, graph, next"
 * @param callback
 * @param {JSON} currentSequence
 * @param tasks
 * @returns {any}
 */
export const flattenSequence = (currentSequence, tasks = []) => {
  // Loop's dead end
  if (!currentSequence) {
    return null
  }
  // If it's a node, it must have current props
  // Current props are including podName, graph
  const node = R.pickAll(['actionName', 'podName', 'graph'], currentSequence)

  if (node && node.podName && node.graph) {
    tasks.push(node)
    return flattenSequence(R.propOr(null, 'next', currentSequence), tasks)
  }

  // Checking if edge exist. Next must be empty because it's an edge
  const keys = R.keys(currentSequence)
  if (!R.isEmpty(keys)) {
    R.map((key) => {
      // console.log('checking key ', key, '  ', keys)
      const composeNextNode = R.compose(
        R.assoc('actionName', key),
        R.propOr(null, key)
      )
      const nextNode = composeNextNode(currentSequence)
      return flattenSequence(nextNode, tasks)
    }, keys)
  }
  return tasks
}
