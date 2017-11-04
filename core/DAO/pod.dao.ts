import * as R from 'ramda'
import * as fluture from 'fluture'
import { default as models } from '../models'
import { AppContext } from '../server'
import { getAllManifests } from '../bridge/node2node'

const Future = fluture.Future

/**
 * Create single pod
 * @param {JSON} manifesto
 */
const createPod = (manifesto: JSON) => Future((rej, res) => {
  const podProps = R.pick(['name', 'title', 'description', 'url', 'icon', 'stage'], manifesto)
  const actions = R.propOr([], 'actions', manifesto)
  const formatActions = R.compose(
    ({ keys, x }) => {
      return R.reduce((acc, key) => {
        const action = R.merge({ name: key }, R.propOr({}, key, x))
        // const actionWithPod = R.merge({ podId: pod.get('id') }, action)
        return R.append(action, acc)
      }, [], keys)
    },
    (x) => {
      const keys = R.keys(x)
      return { keys, x }
    }
  )
  const fullPod = R.merge({ Actions: formatActions(actions) }, podProps)
  models.Pod.create(
    fullPod,
    {
      include: [ models.Action ]
    }
  )
    .then(pod => {
      res(pod)
    })
    .catch(e => rej(e))
})

/**
 * install all pods
 */
export const installPods = (app: AppContext) => Future((rej, res) => {
  R.traverse(Future.of, createPod, getAllManifests())
    .fork(
      e => rej(e),
      pods => res(pods)
    )
})

export const findPodsWithNames = (names: Array<string>) => Future((rej, res) => {
  console.log('checking names ', names)
  models.Pod.findAll({
    where: {
      name: names
    }
  })
    .then(res)
    .catch(rej)
})
