import * as R from 'ramda'
import { Task } from '../queue/index'
import { PipelineInstance } from '../models/Pipeline.model'
import { findAllPipelines } from '../DAO/pipeline.dao'
import * as fluture from 'fluture'
const Future = fluture.Future

const pathDelimiter = '.'
function flattenObj (source, flattened = {}, keySoFar = '') {
  function getNextKey(key) {
    return `${keySoFar}${keySoFar ? pathDelimiter : ''}${key}`
  }
  if (typeof source === 'object') {
    for (const key in source) {
      flatten(source[key], flattened, getNextKey(key))
    }
  } else {
    flattened[keySoFar] = source
  }
  return flattened
}

/**
 * Current sequence can be edge or node
 * edge => "action1"
 * node => "podName, graph, next"
 * @param callback
 * @param {JSON} currentSequence
 * @param tasks
 * @returns {any}
 */
const flattenSequence = (currentSequence, tasks = []) => {
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

const processSequences = (sequence: JSON) => Future((rej, res) => {
  const singleSequence = (node) => Future((rej, res) => {
    setTimeout(() => {
      console.log('single sequence checking node ', node)
      res(2)
    }, 1500)
  })
  const flatSequences = flattenSequence(sequence)
  // TODO: Store result and let it available to the next sequence
  R.traverse(Future.of, singleSequence, flatSequences)
    .fork(
      (e) => rej(e),
      (result) => {
        console.log('processed all sequences!')
        res(result)
      }
    )
})


const processAllSequences = (sequences: Array<JSON>) => Future((rej, res) => {
  R.traverse(Future.of, processSequences, sequences)
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
