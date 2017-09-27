import * as R from 'ramda'
import * as appRoot from 'app-root-path'
import * as fs from 'fs'

/**
 * Using commonjs require all pods' details
 * During development and testing, it will only require pods
 * inside pods/staging/ folder
 */
export const getPodsDetail = () => {
  if (process.env.NODE_ENV === 'development') {
    const stagingPodsFolder = appRoot.resolve('/pods/staging')
    const pods = fs.readdirSync(stagingPodsFolder)
    const getManifests = R.compose(
      R.tap(console.log),
      R.filter((x: JSON | boolean) => x),
      R.map(R.tryCatch(JSON.parse, R.F)),
      R.map((man: string) => fs.readFileSync(man, 'utf8')),
      R.map((pod: string) => `${stagingPodsFolder}/${pod}/manifest.json`)
    )
    return getManifests(pods)
  }
}