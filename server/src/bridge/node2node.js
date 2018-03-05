import fs from 'fs'
import R from 'ramda'
import appRoot from 'app-root-path'
import requireAll from 'require-all'
import changeCase from 'change-case'
import fluture from 'fluture'
import logger from '../logger'

const pods = requireAll(appRoot.resolve('/pods'))

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
  const blacklists = ['.placeholder']
  // Change below to get staging pods
  const getManifests = R.compose(
    // Filter empty ones
    R.filter(R.identity),
    // Try to parse into JSON
    R.map(R.tryCatch(JSON.parse, R.F)),
    // Read each manifest
    R.map(man => fs.readFileSync(man, 'utf8')),
    // Append full manifest path to each pod name
    R.map(pod => `${getFolderPath()}/${pod}/manifest.json`),
    // Filter blacklist items
    R.filter(x => {
      if (blacklists.indexOf(x) === -1) {
        return true
      }
      return false
    }),
  )
  return getManifests(pods)
}

export const invokeAction2 = (podName, actionName, attributes) =>
  Future((rej, res) => {
    const podMethod = R.pathOr(null, [podName, 'index', actionName], pods)
    if (podMethod && podMethod.then) {
      return podMethod(attributes)
        .then(res)
        .catch(rej)
    } else if (typeof podMethod === 'function') {
      const results = podMethod(attributes)
      if (results) {
        return res(results)
      }
      return rej(`Failed to invoke a pod method
       ${actionName} of ${podName}`)
    }
    return rej(`Invalid pod method ${actionName} of ${podName} found`)
  })

/**
 * Invoke a pod's action by podname and actionName
 * @param {string} podName
 * @param {string} actionName
 * @param input
 */
export async function invokeAction({podName, actionName, input}) {
  const env = process.env.NODE_ENV
  const camelActionName = changeCase.camelCase(actionName)
  if (env === 'development' || env === 'test') {
    const stagingPodMethod = R.pathOr(
      null,
      [podName, 'index', camelActionName],
      pods,
    )
    console.log('checking staging pod method ', podName, ' ', camelActionName)
    // If found method is a promise
    if (stagingPodMethod) {
      stagingPodMethod(input)
        .then(result => {
          console.info(`podMethod was successfully invoked
           ${camelActionName} result of podMethod ${result}`)
          return Promise.resolve(result)
        })
        .catch(err => rej(err))
    } else {
      return Promise.reject(
        new Error(`Pod method does not exist
         ${podName} of ${camelActionName}`),
      )
    }
  }
}
/*
export const invokeAction = (podName, actionName, input) =>
  Future((rej, res) => {
    const env = process.env.NODE_ENV
    const camelActionName = changeCase.camelCase(actionName)
    if (env === 'development' || env === 'test') {
      const stagingPodMethod = R.pathOr(
        null,
        [podName, 'index', camelActionName],
        pods,
      )
      console.log('checking staging pod method ', podName, ' ', camelActionName)
      // If found method is a promise
      if (stagingPodMethod) {
        stagingPodMethod(input)
          .then(result => {
            console.info(`podMethod was successfully invoked
             ${camelActionName} result of podMethod ${result}`)
            res(result)
          })
          .catch(err => rej(err))
      } else {
        rej(
          new Error(`Pod method does not exist
           ${podName} of ${camelActionName}`),
        )
      }
    }
  })
*/
