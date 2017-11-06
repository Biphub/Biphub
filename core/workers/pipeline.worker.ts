import * as R from 'ramda'
import { propOr } from 'ramda'
import { logger } from '../logger'
import { Task } from '../queue/index'
import { PipelineInstance } from '../models/Pipeline.model'
import { findAllPipelines, flattenSequence } from '../DAO/pipeline.dao'
import * as nodeBridge from '../bridge/node2node'
import * as fluture from 'fluture'
import { seq } from 'fluture'
const Future = fluture.Future

export interface PayloadType {
  actionName: string;
  podName: string;
  payload: any;
}

/**
 * Process sequences by turning them into a list of futures
 * @param {JSON} sequence
 */
const processSequence = (sequence: Array<JSON>) => Future((rej, res) => {
  const getFutures = R.compose(
    R.map((node) => {
      return (prev = [] as Array<PayloadType>) => Future((rej, res) => {
        const actionName = R.propOr(null, 'actionName', node) as any
        const podName = R.propOr(null, 'podName', node) as any
        // If either one of these is not provided, halt the process
        if (!actionName || !podName) {
          return rej(false)
        }
        logger.info('Init: Task', podName, ':', actionName)
        // Running action
        nodeBridge.invokeAction(podName, actionName, null).fork(
          (err: Error) => {
            logger.error('Action has failed', err)
            rej(err)
          },
          (payload) => {
            // Recursively concatenating payload
            const result = R.concat(prev,
              [{
                actionName,
                podName,
                payload
              }]
            )
            logger.info('Mid: task', podName, ':', actionName)
            res(result)
          }
        )
      })
    }),
    flattenSequence
  )
  const futures = R.apply(R.pipeK)(getFutures(sequence)) as any
  futures(null)
    .fork(
      (e: Error) => {
        console.error(e)
        rej(e)
      },
      (results: Array<PayloadType>) => {
        console.info('Futures sequence successful', results)
        res(results)
      }
    )
})

/**
 * Processing all seq
 * @param {Array<JSON>} sequence
 */
const traverseFlatSequence = (sequence: Array<JSON>) => Future((rej, res) => {
  // Sequence looks like [ { webhook: { podName: 'biphub-pod-fake1', graph: [Object], next: [Object] } } ]
  // Technically it does not need traverse, but we will just receive it here as a backward compatibility
  R.traverse(Future.of as any, processSequence, sequence)
    .fork(
      (e: Error) => rej(e),
      (results: Array<PayloadType>) => res(results)
    )
})

/**
 * Flattens Sequelize retrieved pipeline data
 * @param {Array<PipelineInstance>} pipelines
 */
const flattenPipelines = (pipelines: Array<PipelineInstance>) => Future((rej, res) => {
  if (R.isEmpty(pipelines)) {
    rej(new Error('Flatten pipelines received empty an empty list'))
  }
  const sequences = R.map(x => x.get('sequence'), pipelines)
  res(sequences)
})

/**
 * Execute single queue task
 * @param task
 * @param cb
 */
export const executeTask = (task: Task, cb: Function) => {
  const podName = R.propOr(null, 'name', task)
  const body = R.propOr(null, 'body', task)
  if (!podName || !body) {
    throw new Error('Invalid payload while executing queue task')
  }
  const executeSequence = R.compose(
    R.chain(traverseFlatSequence),
    R.chain(flattenPipelines),
    findAllPipelines
  )
  executeSequence(podName)
    .fork(
      (e: Error) => {
        console.error('Failed to execute a pipeline!')
        cb(e)
      },
      (results: any) => {
        logger.info('End: Pipeline task has finished -', task.name)
        cb(results)
      }
    )
}
