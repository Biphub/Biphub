/**
 * General utilities required for node pods to node hub integration
 */
import * as R from 'ramda'
import * as appRoot from 'app-root-path'
import * as fs from 'fs'
import * as relative from 'relative'

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
    R.tap(console.log),
    R.filter((x: JSON | boolean) => x),
    R.map(R.tryCatch(JSON.parse, R.F)),
    R.map((man: string) => fs.readFileSync(man, 'utf8')),
    R.map((pod: string) => `${getFolderPath()}/${pod}/manifest.json`)
  )
  return getManifests(pods)
}

/**
 * Invoke a pod's action by podname and actionName
 * @param {string} podName
 * @param {string} actionName
 * @param payload
 */
export const invokeAction = (podName: string, actionName: string, payload: any) => {
  const pods = getAllPods()
  // fs.readFileSync(`${getFolderPath()}/${podName}.js`)
  console.log('checking folder path')
  const podFile = R.compose(
    //pod => fs.readFileSync(`${getFolderPath()}/${pod}`, 'utf8'),
    pod => relative('.', pod),
    pod => `${getFolderPath()}/${pod}`,
    (pod) => {
      console.log('checking pod ', pod)
      return pod
    },
    (pod: string) => {
      if(R.test(/\.js&/g, pod)) {
        return pod
      }
      return `${pod}.js`
    }
  )
  console.log('checking pod file path ', podFile(podName));
  console.log('checking pods ', pods, 'z  ')
}

