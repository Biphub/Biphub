import R from 'ramda'
import {logger} from '../logger'
import {Task} from '../queue/index'
import {findAllPipelines, flattenSequence} from '../DAO/pipeline.dao'
import * as nodeBridge from '../bridge/node2node'
import fluture from 'fluture'

const Future = fluture.Future
/**
 * Process sequences by turning them into a list of futures
 * @param {JSON} sequence
 */
const processSequence = sequence => Future((rej, res) => {
  const getFutures = R.compose(
    R.map(node => {
      return prev => Future((rej, res) => {
        const actionName = R.propOr(null, 'actionName', node)
        const podName = R.propOr(null, 'podName', node)
        // If either one of these is not provided, halt the process
        if (!actionName || !podName) {
          return rej(false)
        }
        logger.info('Init: Task', podName, ':', actionName)
        // Running action
        // TODO: Fix from here!
        nodeBridge.invokeAction(podName, actionName, null).fork(
          err => {
            logger.error('Action has failed', err)
            rej(err)
          },
          payload => {
            const _prev = prev ? prev : []
            // Recursively concatenating payload
            const result = R.concat(_prev,
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
  const futures = R.apply(R.pipeK)(getFutures(sequence))
  futures(null)
    .fork(
      e => {
        logger.error(e)
        rej(e)
      },
      results => {
        console.info('Futures sequence successful', results)
        res(results)
      }
    )
})

/**
 * Processing all seq
 * @param {Array<JSON>} sequence
 */
const traverseFlatSequence = sequence => Future((rej, res) => {
  // Sequence looks like [ { webhook: { podName: 'biphub-pod-fake1', graph: [Object], next: [Object] } } ]
  // Technically it does not need traverse, but we will just receive it here as a backward compatibility
  R.traverse(Future.of, processSequence, sequence)
    .fork(
      e => rej(e),
      results => res(results)
    )
})

/**
 * Flattens Sequelize retrieved pipeline data
 * @param {Array<PipelineInstance>} pipelines
 */
const flattenPipelines = pipelines => Future((rej, res) => {
  if (R.isEmpty(pipelines)) {
    rej(new Error('Flatten pipelines received empty an empty list'))
  }
  const sequences = R.map(x => x.get('sequence'), pipelines)
  logger.info('flatten sequences ', sequences)
  res(sequences)
})

/**
 * Execute single queue task
 * @param task
 * @param cb
 */
export const executeTask = (task, cb) => {
  const podName = R.propOr(null, 'name', task)
  const body = R.propOr(null, 'body', task)
  console.log('executing task', task, ' checking cb ', cb)
  if (!podName || !body) {
    throw new Error('Invalid payload while executing queue task')
  }
  const executeSequence = R.compose(
    R.chain(traverseFlatSequence),
    R.chain(flattenPipelines),
    findAllPipelines
  )
  console.log('checking execute seq ', executeSequence, Future)

  executeSequence(podName)
    .fork(
      e => {
        logger.error('Failed to execute a pipeline!', e)
        cb(e)
      },
      results => {
        logger.info('End: Pipeline worker task has finished -', task.name)
        cb(results)
      }
    )
}
