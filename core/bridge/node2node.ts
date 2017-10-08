/**
 * General utilities required for node pods to node hub integration
 */
import * as R from 'ramda'
import * as appRoot from 'app-root-path'
import * as fs from 'fs'
import * as path from 'path'
import * as requireAll from 'require-all'
import * as changeCase from 'change-case'
import * as fluture from 'fluture'
const stagingPods = requireAll(path.join(__dirname, '/../../pods/staging'))

const Future = fluture.Future

/**
 *
 * @returns {string}
 */
const getFolderPath = () => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    return appRoot.resolve('/pods/staging')
  }
}

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
  const getManifests = R.compose(
    R.filter((x: JSON | boolean) => x),
    R.map(R.tryCatch(JSON.parse, R.F)),
    R.map((man: string) => fs.readFileSync(man, 'utf8')),
    R.map((pod: string) => `${getFolderPath()}/${pod}/manifest.json`)
  )
  const manifests = getManifests(pods)
  stagingPods['biphub-pod-fake1'].index.postFakeMessage()
  return manifests
}

/**
 * Invoke a pod's action by podname and actionName
 * @param {string} podName
 * @param {string} actionName
 * @param payload
 */
export const invokeAction = (podName: string, actionName: string, payload: any) => {
  // TODO: Should we check it here?
  if (actionName === 'webhook') {
    // We don't have to invoke any action of type "webhook"
    return null
  }
  const env = process.env.NODE_ENV
  const camelActionName = changeCase.camelCase(actionName)
  // const stagingPodMethod = R.propOr(null, `${podName}.index.${camelActionName}`, stagingPods)
  if (env === 'development' || env === 'test') {
    const stagingPodMethod = stagingPods[podName]['index'][camelActionName]
    if (!stagingPodMethod) {
      return null
    }
  }
}

