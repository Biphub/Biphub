import R from 'ramda'
import fluture from 'fluture'
import logger from '../logger'
import { findPodByName } from '../DAO/pod.dao'
import { findAllPipelines } from '../DAO/pipeline.dao'
import * as nodeBridge from '../bridge/node2node'
import format from 'string-template'

const Future = fluture.Future

const processDataMap = (apiResponses, dataMap) =>
  Future((rej, res) => {
    console.log('checking apiResponseDict', apiResponses)
    console.log('datamap ', dataMap)
    // 1. if there is dataMap.text handle it
    // 1.1. catch any exceptions
    const textTemplate = R.prop('textTemplate', dataMap)
    if (textTemplate) {
      // Format(textTemplate, resultsDict)
    }
    // Otherwise simply return an empty object
    res({})
  })

const handleNextAction = ({
  podName,
  actionName,
  initialPayload,
  apiResponses,
  input,
}) =>
  Future((frej, fres) => {
    // If either one of these is not provided, halt the process
    if (!actionName || !podName) {
      return frej(
        new Error(`Invalid node found in process pipeline.
                This is not permitted`),
      )
    }
    logger.info('======================================')
    logger.info('Init: Task', podName, ':', actionName)

    // Handle any triggers (e.g. webhook)
    // TODO: Any chain must start with a trigger
    if (actionName === 'webhook') {
      const newApiResponses = R.concat(apiResponses, [initialPayload])
      return fres(newApiResponses)
    }

    // Running action
    // FIXME: Later, should we support more than just nodeBridge?
    nodeBridge.invokeAction(podName, actionName, input).fork(
      err => {
        logger.error(
          'Action has failed; Task:',
          `${podName}:${actionName}`,
          err,
        )
        frej(err)
      },
      payload => {
        //  const resIndex = R.findIndex(R.propEq('podId', id), resultsDict)
        const nextPayload = {
          podName,
          actionName,
          payload,
        }
        const newApiResponses = R.concat(apiResponses, [nextPayload])
        console.log('Checking newApiResponses', newApiResponses)
        logger.info('End of a task for ', podName)
        logger.info('======================================')
        fres(newApiResponses)
      },
    )
  })

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
    // Flatten all ids from edges
    const flatActionIds = R.compose(
      // Commenting out initial trigger id
      R.prepend(edges[0].from),
      R.map(edge => edge.to),
    )(edges)
    // Get all bridge actions in a map
    const mapIndexed = R.addIndex(R.map)
    const getFutures = mapIndexed((id, idx) => {
      return apiResponses =>
        Future((frej, fres) => {
          // FIXME: Do we need this?
          apiResponses = apiResponses ? apiResponses : []
          // Current node data
          const fromNode = R.find(R.propEq('id', id), nodes)
          const actionName = R.propOr(null, 'actionName', fromNode)
          const podName = R.propOr(null, 'podName', fromNode)

          // Current edge data
          const edgeLens = R.lensIndex(Math.floor(idx / 2))
          const edge = R.view(edgeLens, edges)
          const edgeId = R.prop('id', edge)

          // Datamap
          const dataMap = R.find(R.propEq('edgeId', edgeId), dataMaps)

          R.compose(
            R.chain(input =>
              handleNextAction({
                podName,
                actionName,
                initialPayload,
                apiResponses,
                input,
              }),
            ),
            () => {
              return processDataMap(apiResponses, dataMap)
            },
          )().fork(error => frej(error), result => fres(result))
        })
    })
    const futures = R.apply(R.pipeK)(getFutures(flatActionIds))
    futures(null).fork(rej, res)
  }),
)

const traversePipelines = R.curry((initialPayload, pipelines) =>
  Future((rej, res) => {
    if (R.isEmpty(pipelines)) {
      rej(new Error('Pipeline traverse failed because it is an empty list!'))
    }
    console.log('checking initial payload', initialPayload)
    R.traverse(Future.of, processPipeline(initialPayload), pipelines).fork(
      rej,
      res,
    )
  }),
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
    findAllPipelines,
  )

  executeSequence(podName).fork(
    e => {
      logger.error('Failed to execute a pipeline!', e)
      cb(e)
    },
    results => {
      logger.info(
        'End: Pipeline worker task has finished -',
        task.name,
        ' ',
        results,
      )
      cb(results)
    },
  )
}

export default {
  executeTask,
}
