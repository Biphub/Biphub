import R from 'ramda'
import fluture from 'fluture'
import logger from '../logger'
import {findPodByName} from '../DAO/pod.dao'
import {findAllPipelines} from '../DAO/pipeline.dao'
import * as nodeBridge from '../bridge/node2node'

const Future = fluture.Future

const findDataMap = (dataMap, edgeId) => {

}

/**
 * Process sequences by turning them into a list of futures
 * NOTE: Leaving below comments as a recording keeping.
 * Please delete them later on.
 * @param {JSON} sequence
 */
const processPipeline = R.curry((initialPayload, pipeline) =>
 Future((rej, res) => {
   const nodes = pipeline.nodes
   const edges = pipeline.edges
   const dataMaps = pipeline.dataMaps
   const flatEdgeIds = R.compose(
     R.prepend(edges[0].from),
     R.map(edge => edge.to)
   )(edges)
   // Get all bridge actions in a map
   const mapIndexed = R.addIndex(R.map)
   const getFutures = mapIndexed((id, idx) => {
     return results => Future((frej, fres) => {
       results = results ? results : []
       const fromNode = R.find(R.propEq('id', id), nodes)
       const actionName = R.propOr(null, 'actionName', fromNode)
       const podName = R.propOr(null, 'podName', fromNode)

       // Find current edge id using map index
       const edgeLens = R.lensIndex(Math.floor(idx / 2))
       const edge = R.view(edgeLens, edges)
       const edgeId = R.prop('id', edge)

       // Find current edge's datamap
       const dataMap = R.find(R.propEq('edgeId', edgeId), dataMaps)
       console.log('found a datamap', dataMap, ' results: ', results)
       // If either one of these is not provided, halt the process
       if (!actionName || !podName) {
         return frej(new Error(`Invalid node found in process pipeline.
         This is not permitted`))
       }
       logger.info('======================================')
       logger.info('Init: Task', podName, ':', actionName,
       ' ; initial payload ', initialPayload)

       // Running action
       nodeBridge.invokeAction(podName, actionName, dataMap).fork(
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
