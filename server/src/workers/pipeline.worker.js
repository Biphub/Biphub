import R from 'ramda'
import fluture from 'fluture'
import logger from '../logger'
import {findAllPipelines} from '../DAO/pipeline.dao'
import * as nodeBridge from '../bridge/node2node'

const Future = fluture.Future
/**
 * Process sequences by turning them into a list of futures
 * NOTE: Leaving below comments as a recording keeping.
 * Please delete them later on.
 * @param {JSON} sequence
 */
/*
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
        // Running an action
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
  console.log('checking stuff')
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

const traverseFlatSequence = sequence => Future((rej, res) => {
  // Sequence looks like [ { webhook:
  // {  podName: 'biphub-pod-fake1', graph: [Object], next: [Object] } } ]
  // Technically it does not need traverse, but we will
  // just receive it here as a backward compatibility
  R.traverse(Future.of, processSequence, sequence)
    .fork(
      e => rej(e),
      results => res(results)
    )
})
*/

/**
 * Flattens Sequelize retrieved pipeline data
 * @param {Array<PipelineInstance>} pipelines
 */
/*
const flattenPipelines = pipelines => Future((rej, res) => {
  if (R.isEmpty(pipelines)) {
    rej(new Error('Flatten pipelines received empty an empty list'))
  }
  const sequences = R.map(x => x.get('sequence'), pipelines)
  logger.info('flatten sequences ', sequences)
  res(sequences)
})
*/

const processPipeline = R.curry((initialPayload, pipeline) =>
 Future((rej, res) => {
   const nodes = pipeline.nodes
   const edges = pipeline.edges
   const flatEdgeIds = R.reduce((acc, edge) => R.concat(acc,
   [edge.from, edge.to]), [], edges)

  // Get all bridge actions in a map
   const getFutures = R.map(id => {
     return results => Future((frej, fres) => {
       results = results ? results : []
       const fromNode = R.find(R.propEq('id', id), nodes)
       const actionName = R.propOr(null, 'actionName', fromNode)
       const podName = R.propOr(null, 'podName', fromNode)
      // If either one of these is not provided, halt the process
       if (!actionName || !podName) {
         return frej(new Error(`Invalid node found in process pipeline.
         This is not permitted`))
       }
       logger.info('======================================')
       logger.info('Init: Task', podName, ':', actionName,
       ' ; initial payload ', initialPayload)
      // Running action
       nodeBridge.invokeAction(podName, actionName, initialPayload).fork(
        err => {
          logger.error('Action has failed; Task:',
                       `${podName}:${actionName}`, err)
          frej(err)
        },
        payload => {
          const resIndex = R.findIndex(R.propEq('id', id), results)
          const nextPayload = {id, payload}
          // ResIndex === -1 means it's a new result
          if (resIndex === -1) {
            const x = R.concat(results, [nextPayload])
            // Simply add the new result into results array
            return fres(x)
          }
          results[resIndex] = nextPayload
            // Replaces existing index with nextPayload
          logger.info('End of a task for ', podName)
          logger.info('======================================')
          fres(results)
        }
      )
     })
   })
   const futures = R.apply(R.pipeK)(getFutures(flatEdgeIds))
   futures(null).fork(rej, res)
 }))

const traversePipelines = R.curry((initialPayload, pipelines) =>
  Future((rej, res) => {
    if (R.isEmpty(pipelines)) {
      rej(
        new Error('Pipeline traverse failed because it is an empty list!')
      )
    }
    console.log('checking initial payload', initialPayload)
    R.traverse(Future.of, processPipeline(initialPayload), pipelines)
      .fork(rej, res)
  })
)

/**
 * Execute single queue task
 * @param task
 * @param cb
 */
const executeTask = (task, cb) => {
  const podName = R.propOr(null, 'name', task)
  const body = R.propOr(null, 'body', task)
  if (!podName || !body) {
    throw new Error('Invalid payload while executing queue task')
  }
  const executeSequence = R.compose(
    // R.chain(traverseFlatSequence),
    // R.chain(flattenPipelines),
    R.chain(traversePipelines(body)),
    findAllPipelines
  )

  executeSequence(podName)
    .fork(
      e => {
        logger.error('Failed to execute a pipeline!', e)
        cb(e)
      },
      results => {
        logger.info('End: Pipeline worker task has finished -',
          task.name, ' ', results)
        cb(results)
      }
    )
}

export default {
  executeTask
}
