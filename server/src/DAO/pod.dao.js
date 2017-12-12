import R from 'ramda'
import fluture from 'fluture'
import {models} from '../models'
import {AppContext} from '../server'
import {getAllManifests} from '../bridge/node2node'
import {PodModel} from '../models/Pod.model'
import {Applicative} from 'ramda'
const Future = fluture.Future


//**************
// READ
// ************
/**
 * Find all pods with given list of names
 * @param names
 */
export const findPodsWithNames = names => Future((rej, res) => {
  models.Pod.findAll({
    where: {
      name: names
    }
  })
    .then(res)
    .catch(rej)
})

/**
 * Simply grabs all the pods
 */
const findAllPods = () => Future((rej, res) => {
  models.Pod.findAll().then(res).catch(rej)
})


//****************
// WRITE
//****************
/**
 * Create a single pod using a manifesto or custom JSON
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
 * Delete all pods with ids
 * @param ids
 */
export const deletePods = (ids) => Future((rej, res) => {
  models.Pod.destroy({ where: { id: ids } })
    .then((result) => {
      res(`Deletes all pods! ${ids} ${result}`)
    })
    .catch(rej)
})

/**
 * Install all pods
 * @param app
 */
export const installPods = app => Future((rej, res) => {
  R.traverse(Future.of, createPod, getAllManifests())
    .fork(
      e => rej(e),
      pods => res(pods)
    )
})

/**
 * Remove all pods
 */
export const uninstallPods = () => Future((rej, res) => {
  // Flatten pods as array of ids
  const flatPods = (pods) => Future((rej, res) => {
    const ids = R.compose(
      R.map(x => x.id),
      R.map(x => x.toJSON())
    )(pods)
    res(ids)
  })
  R.compose(
    R.chain(deletePods),
    R.chain(flatPods),
    findAllPods
  )().fork(rej, res)
})
