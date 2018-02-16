import R from 'ramda'
import fluture from 'fluture'
import logger from '../logger'
import {models} from '../models'

const Future = fluture.Future

export function listAll() {
  return Future((rej, res) => {
    models.Pipeline.findAll()
      .then(value => res(value))
      .catch(err => rej(err))
  })
}

/**
 * Creates a pipeline
 * @param pipeline
 * @returns {any} // TODO Fix any type
 */
export function create(pipeline) {
  return fluture.Future((rej, res) => {
    models.Pipeline.create(pipeline)
      .then(value => res(value))
      .catch(err => rej(err))
  })
}

/**
 * Find all pipelines by entry app name.
 * @param {string} entryApp
 */
export const findAllPipelines = entryApp => Future((rej, res) => {
  models.Pipeline.findAll({
    where: {
      entryApp
    }
  })
    .then(pipelines => {
      if (R.isEmpty(pipelines)) {
        logger.error(
          `Could not retrieve any pipelines of 
          ${entryApp}, did you run node manage installAll?`
        )
        return rej()
      }
      res(pipelines)
    })
    .catch(err => rej(err))
})

/**
 * Current sequence can be edge or node
 * edge => "action1"
 * node => "podName, graph, next"
 * @param {JSON} currentSequence
 * @param nodes
 * @returns {any}
 */
export const flattenSequence = (currentSequence, nodes = []) => {
  // Loop's dead end
  if (!currentSequence) {
    return null
  }
  // If it's a node, it must have current props
  // Current props are including podName, graph

  const node = (
    R.pickAll(['actionName', 'podName', 'graph'],
      currentSequence
    )
  )

  if (node && node.podName && node.graph) {
    nodes.push(node)
    // Getting edge. It can be { any } or null
    const next = R.propOr(null, 'next', currentSequence)
    return flattenSequence(next, nodes)
  }

  // Checking if edge exist. Next must be empty because it's an edge
  const keys = R.keys(currentSequence)
  if (!R.isEmpty(keys)) {
    R.map(key => {
      const composeNextNode = R.compose(
        R.assoc('actionName', key),
        R.propOr(null, key)
      )
      const nextNode = composeNextNode(currentSequence)
      return flattenSequence(nextNode, nodes)
    }, keys)
  }
  return nodes
}
