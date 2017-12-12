/**
 * General utilities required for node pods to node hub integration
 */
import R from 'ramda'
import appRoot from 'app-root-path'
import fs from 'fs'
import path from 'path'
import requireAll from 'require-all'
import changeCase from 'change-case'
import fluture from 'fluture'
import { logger } from '../logger'

const pods = requireAll(path.join(__dirname, '/../../pods'))

const Future = fluture.Future

/**
 * Gets the current app root path
 * @returns {string}
 */
const getFolderPath = () => appRoot.resolve('/pods')

/**
 * Get all pods according to current ENV
 * During development and testing, it will only require pods
 * inside pods/staging/ folder
 * @returns {any}
 */
const getAllPods = () => fs.readdirSync(getFolderPath())

/**
 * Using commonjs require all pods' details
 */
export const getAllManifests = () => {
  const pods = getAllPods()
  // Change below to get staging pods
  const getManifests = R.compose(
    // Filter empty ones
    R.filter(R.identity),
    R.map(R.tryCatch(JSON.parse, R.F)),
    R.map(man => fs.readFileSync(man, 'utf8')),
    R.map(pod => `${getFolderPath()}/${pod}/manifest.json`)
  )
  return getManifests(pods)
}

/**
 * Invoke a pod's action by podname and actionName
 * @param {string} podName
 * @param {string} actionName
 * @param initialPayload
 */
export const invokeAction = (podName, actionName, initialPayload) => Future((rej, res) => {
  // NOTE: skipping webhook, poll, and etc happens here!
  if (actionName === 'webhook') {
    // We don't have to invoke any action of type "webhook"
    logger.info('Checking webhook action ', initialPayload)
    return res(initialPayload)
  }
  const env = process.env.NODE_ENV
  const camelActionName = changeCase.camelCase(actionName)
  if (env === 'development' || env === 'test') {
    const stagingPodMethod = R.pathOr(null, [podName, 'index', camelActionName], pods)
    // If found method is a promise
    if (stagingPodMethod) {
      stagingPodMethod({text: 'lol'})
        .then(result => {
          console.info('podMethod was successfully invoked', camelActionName, 'result of podMethod', result)
          res(result)
        })
        .catch(err => rej(err))
    } else {
      rej(new Error(`Pod method does not exist ${podName} of ${camelActionName}`))
    }
  }
})
