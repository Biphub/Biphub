import * as R from 'ramda'
import * as fluture from 'fluture'
import { default as models } from '../models'
import { getAllManifests } from '../bridge/node2node'

const Future = fluture.Future

/**
 * Create single pod
 * @param {JSON} manifesto
 */
const createPod = (manifesto: JSON) => Future((rej, res) => {
  const props = R.pick(['name', 'title', 'description', 'url'], manifesto)
  console.log('checking props ', props)
  models.Pod.create(props)
    .then(pod => res(pod))
    .catch(e => rej(e))
})

/**
 * install all pods
 */
export const installPods = () => Future((rej, res) => {
  R.traverse(Future.of, createPod, getAllManifests())
    .fork(
      e => rej(e),
      pods => res(pods),
    )
})
