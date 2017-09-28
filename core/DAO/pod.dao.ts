import * as R from 'ramda'
import { default as models } from '../models'
import { getAllManifests } from '../bridge/node2node'

const createPod = (manifest: JSON) => {
  const props = R.pick(['name', 'title', 'description', 'url'], manifest)
  console.log('checking props ', props)
}
/**
 *
 */
export const installPods = (manifesto: Array) => {
  const manifests = getAllManifests()
  createPod(manifests[0])
}

