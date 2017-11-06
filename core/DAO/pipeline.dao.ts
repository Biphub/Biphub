import * as R from 'ramda'
import { models } from '../models'
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
  models.Pipeline.findAll<PipelineModel>({
    where: {
      entryApp: entryApp
    }
  })
    .then((pipelines: Array<PipelineModel>) => {
      res(pipelines)
    })
    .catch((e: Error) => rej(e))
})

// Below type is used for node of each sequence
interface NodeType {
  actionName: string;
  podName: string;
  graph: JSON;
  next: JSON | null
}

/**
 * Current sequence can be edge or node
 * edge => "action1"
 * node => "podName, graph, next"
 * @param {JSON} currentSequence
 * @param tasks
 * @returns {any}
 */
export const flattenSequence = (currentSequence: NodeType | any, tasks: Array<any> = []): Array<JSON> => {
  // Loop's dead end
  if (!currentSequence) {
    return null
  }
  // If it's a node, it must have current props
  // Current props are including podName, graph

  const node = (
    R.pickAll(['actionName', 'podName', 'graph'],
      currentSequence
    ) as NodeType
  )

  if (node && node.podName && node.graph) {
    tasks.push(node)
    // Getting edge. It can be { any } or null
    const next = R.propOr(null, 'next', currentSequence) as any
    return flattenSequence(next, tasks)
  }

  // Checking if edge exist. Next must be empty because it's an edge
  const keys = R.keys(currentSequence)
  if (!R.isEmpty(keys)) {
    R.map((key) => {
      const composeNextNode = R.compose(
        R.assoc('actionName', key),
        R.propOr(null, key)
      )
      const nextNode = composeNextNode(currentSequence) as NodeType
      return flattenSequence(nextNode, tasks)
    }, keys)
  }
  return tasks
}
