import * as R from 'ramda'
import * as fluture from 'fluture'
import { default as models } from '../models'
import { createManyActions } from './action.dao'
import { getAllManifests } from '../bridge/node2node'

const Future = fluture.Future

/**
 * Create single pod
 * @param {JSON} manifesto
 */
const createPod = (manifesto: JSON) => Future((rej, res) => {
  const podProps = R.pick(['name', 'title', 'description', 'url'], manifesto)
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
      /* if (!R.isEmpty(actions)) {
        createManyActions(actions, pod).fork(
          () => console.error('failed to create actions'),
          (actions) => {
            console.log('create many actions ', actions)
          }
        )
      } */
      res(pod)
    })
    .catch(e => rej(e))
})

/**
 * install all pods
 */
export const installPods = () => Future((rej, res) => {
  R.traverse(Future.of, createPod, getAllManifests())
    .fork(
      e => rej(e),
      pods => res(pods)
    )
})
