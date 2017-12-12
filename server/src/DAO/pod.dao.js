import R from 'ramda'
import fluture from 'fluture'
import {models} from '../models'
import {AppContext} from '../server'
import {getAllManifests} from '../bridge/node2node'
import {PodModel} from '../models/Pod.model'
import {Applicative} from 'ramda'

const Future = fluture.Future

/**
 * Create single pod
 * @param {JSON} manifesto
 */
const createPod = manifesto => Future((rej, res) => {
  const actions = R.propOr([], 'actions', manifesto)
  const formatActions = R.compose(
    ({keys, x}) => {
      return R.reduce((acc, key) => {
        const action = R.merge({name: key}, R.propOr({}, key, x))
        return R.append(action, acc)
      }, [], keys)
    },
    x => {
      const keys = R.keys(x)
      return {keys, x}
    }
  )
  // Merging manifesto and Actions
  const fullPod = R.merge({Actions: formatActions(actions)}, manifesto)
  models.Pod.create(
    fullPod,
    {
      include: [models.Action]
    }
  )
    .then(res)
    .catch(rej)
})

/**
 * Install all pods
 */
export const installPods = app => Future((rej, res) => {
  R.traverse(Future.of, createPod, getAllManifests())
    .fork(
      e => rej(e),
      pods => res(pods)
    )
})

export const findPodsWithNames = names => Future((rej, res) => {
  models.Pod.findAll({
    where: {
      name: names
    }
  })
    .then(res)
    .catch(rej)
})
