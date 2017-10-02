import * as R from 'ramda'
import { Task } from '../queue/index'
import { PipelineInstance } from '../models/Pipeline.model'
import { findAllPipelines } from '../DAO/pipeline.dao'
import * as fluture from 'fluture'
const Future = fluture.Future

/**
 * Current sequence can be edge or node
 * edge => "action1"
 * node => "podName, graph, next"
 * @param callback
 * @param {JSON} currentSequence
 * @returns {any}
 */
const loopSequence = (callback: Function, currentSequence: any) => {
  // Loop's dead end
  if (R.isEmpty(currentSequence)) {
    return null
  }
  // If it's a node, it must have current props
  // Current props are including podName, graph
  const node = R.pickAll(['podName', 'graph'], currentSequence)

  if (node && node.podName && node.graph) {
    callback(node)
    loopSequence(callback, R.propOr(null, 'next', currentSequence))
  }

  // Checking if edge exist. Next must be empty because it's an edge
  const keys = R.keys(currentSequence)
  if (!R.isEmpty(keys)) {
    R.forEach((key) => {
      loopSequence(callback, R.propOr(null, key, currentSequence))
    }, keys)
  }
}

const processSequence = (sequence: JSON) => Future((rej, res) => {
  res(sequence)
})


const processAllSequences = (sequences: Array<JSON>) => Future((rej, res) => {
  R.traverse(Future.of, processSequence, sequences)
    .fork(
      (e) => rej(e),
      (results) => res(results)
    )
})

const flattenPipelines = (pipelines: Array<PipelineInstance>) => Future((rej, res) => {
  if (R.isEmpty(pipelines)) {
    rej(new Error('Flatten pipelines received empty an empty list'))
  }
  const sequences = R.map(x => x.get('sequence'), pipelines)
  res(sequences)
})

/**
 *
 * @param task
 */
export const executeTask = (task: Task, cb: Function) => {
  const podName = R.propOr(null, 'name', task)
  const body = R.propOr(null, 'body', task)
  if (!podName || !body) {
    throw new Error('Invalid payload while executing queue task')
  }
  const executeSequence = R.compose(
    R.chain(processAllSequences),
    R.chain(flattenPipelines),
    findAllPipelines
  )
  executeSequence(podName)
    .fork(
      (e: Error) => {
        console.error('Failed to execute a pipeline!')
        cb(e)
      },
      () => {
        console.info('Successfully executed all the pipeline tasks for', task.name)
        cb()
      }
    )
}
