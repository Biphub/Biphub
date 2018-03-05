import R from 'ramda'
import fluture from 'fluture'
import logger from '../logger'
import { findAllPipelines } from '../DAO/pipeline.dao'
import nodeBridge from '../bridge/node2node'
import format from 'string-template'

const Future = fluture.Future

async function processDataMap({apiResponses, dataMap}) {
  if (!dataMap) {
    // Return an empty object if dataMap is invalid
    return Promise.resolve({})
  }
  // 1. if there is dataMap.text handle it
  // 1.1. catch any exceptions
  const textTemplate = R.prop('textTemplate', dataMap)
  if (textTemplate) {
    // Format(textTemplate, resultsDict)
  }
  // Otherwise simply return an empty object
  return Promise.resolve({})
}

async function invokeAction({
  podName,
  actionName,
  initialPayload,
  apiResponses,
  input,
}) {
  if (!actionName || !podName) {
    return Promise.reject(
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
    return Promise.resolve(newApiResponses)
  }

  // Running action
  // FIXME: Later, should we support more than just nodeBridge?z
  const payload = await nodeBridge.invokeAction({podName, actionName, input})
  const nextPayload = {
    podName,
    actionName,
    payload,
  }
  logger.info('End of the task')
  console.log(nextPayload)
  console.log('checking promise resolve')
  console.log(Promise.resolve)
  console.log('')
  // logger.info('======================================')
  return Promise.resolve(nextPayload)
}

async function handleAction(
  podName,
  actionName,
  dataMap,
  initialPayload,
  apiResponses
) {

  const input = await processDataMap({apiResponses, dataMap})
  const actionResult = await invokeAction({
    podName,
    actionName,
    initialPayload,
    apiResponses,
    input
  })
  console.log('handling action! ')
  console.log(actionResult)
  console.log('')
  return Promise.resolve(actionResult)
}

async function getFutureActions({
  nodes,
  edges,
  dataMaps,
  initialPayload
}) {
  const flatActionIds = R.compose(
    // Commenting out initial trigger id
    R.prepend(edges[0].from),
    R.map(edge => edge.to),
  )(edges)
  const mapIndexed = R.addIndex(R.map)
  const getFutures = mapIndexed((id, index) => {
    return apiResponses =>
      Future((frej, fres) => {
        apiResponses = apiResponses ? apiResponses : []
        // Current node data
        const fromNode = R.find(R.propEq('id', id), nodes)
        // Action and podName
        const actionName = R.prop('actionName', fromNode)
        const podName = R.prop('podName', fromNode)
        const edgeIndex = R.lensIndex(Math.floor(index / 2))
        const edge = R.view(edgeIndex, edges)
        const edgeId = R.prop('id', edge)
        let dataMap
        if (dataMaps) {
          dataMap = R.find(R.propEq('id', edgeId), dataMaps)
        }
        if (!podName) return Promise.reject(`Invalid podName: ${podName}`)
        if (!actionName)
          return Promise.reject(`Invalid actionName: ${actionName}`)
        if (!initialPayload)
          return Promise.reject(`Invalid initial payload: ${initialPayload}`)
        if (!apiResponses)
          return Promise.reject(`Invalid apiResponses: ${apiResponses}`)

        handleAction(
          podName,
          actionName,
          dataMap,
          initialPayload,
          apiResponses
        ).then(fres).catch(frej)
      })
  })
  const futures = R.apply(R.pipeK)(getFutures(flatActionIds))
  // const futures = getFutures(flatActionIds)
  return Promise.resolve(futures)
}

/**
 * Process sequences by turning them into a list of futures
 * NOTE: Leaving below comments as a recording keeping.
 * Please delete them later on.
 * @param {JSON} sequence
 */
const processPipeline = R.curry((initialPayload, pipeline) =>
  Future((rej, res) => {
    const nodes = pipeline.get('nodes')
    const edges = pipeline.get('edges')
    // Datamaps can be null
    const dataMaps = pipeline.get('dataMaps')
    // Null check
    if (!nodes) return rej('Payload.Nodes is null')
    if (!edges) return rej('payload.edges is null')
    return getFutureActions({
      nodes,
      edges,
      dataMaps,
      initialPayload
    }).then((futures) => {
      futures(null).fork(
        rej,
        (result) => {
          console.log('finished invoking ', result)
          console.log('aoaoao', res)
          console.log('')
          res(result)
        }
      )
    }).catch(rej)


  }),
)

const traversePipelines = R.curry((initialPayload, pipelines) =>
  Future((rej, res) => {
    if (R.isEmpty(pipelines)) {
      rej(new Error('Pipeline traverse failed because it is an empty list!'))
    }
    R.traverse(Future.of, processPipeline(initialPayload), pipelines).fork(
      rej,
      (result) => {
        console.log('traverpipe!! done!1 ', result)
        res(result)
      },
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
      console.log('hey!')
      cb(results)
    },
  )
}

export default {
  executeTask,
}
