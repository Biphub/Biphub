import R from 'ramda'
import fluture from 'fluture'
import { models } from '../models'
import { getAllManifests } from '../bridge/node2node'

const { Pod } = models
const Future = fluture.Future

export const findPodByName = name =>
  Future((rej, res) => {
    Pod.findOne({
      where: { name },
    })
      .then(res)
      .catch(rej)
  })

//* *************
// READ METHODS
// ************
/**
 * Find all pods with given list of names
 * @param names
 */
export const findPodsWithNames = names =>
  Future((rej, res) => {
    Pod.findAll({
      where: {
        name: names,
      },
    })
      .then(res)
      .catch(rej)
  })

/**
 * Simply grabs all the pods
 */
const findAllPods = () =>
  Future((rej, res) => {
    Pod.findAll()
      .then(res)
      .catch(rej)
  })

//* ***************
// WRITE METHODS
//* ***************
/**
 * Create a single pod using a manifesto or custom JSON
 * @param {JSON} manifesto
 */
const createPod = manifesto =>
  Future((rej, res) => {
    const actions = R.propOr([], 'actions', manifesto)
    const podAuths = R.propOr([], 'podAuths', manifesto)
    const formatProp = R.compose(
      ({ keys, x }) => {
        return R.reduce(
          (acc, key) => {
            const action = R.merge({ name: key }, R.propOr({}, key, x))
            return R.append(action, acc)
          },
          [],
          keys
        )
      },
      x => {
        const keys = R.keys(x)
        return { keys, x }
      }
    )
    // Merging manifesto and Actions
    const fullPod = R.merge(
      {
        Actions: formatProp(actions),
        PodAuths: formatProp(podAuths),
      },
      manifesto
    )
    Pod.create(fullPod, {
      include: [models.Action, models.PodAuth],
    })
      .then(res)
      .catch(rej)
  })

/**
 * Delete all pods with ids
 * @param ids
 */
export const deletePods = ids =>
  Future((rej, res) => {
    Pod.destroy({ where: { id: ids } })
      .then(result => {
        res(`Deletes all pods! ${ids} ${result}`)
      })
      .catch(rej)
  })

/**
 * Install all pods
 * @param app
 */
export const installPods = () =>
  Future((rej, res) => {
    R.traverse(Future.of, createPod, getAllManifests()).fork(
      e => rej(e),
      pods => res(pods)
    )
  })

/**
 * Remove all pods
 */
export const uninstallPods = () =>
  Future((rej, res) => {
    // Flatten pods as array of ids
    const flatPods = pods =>
      Future((rej, res) => {
        const ids = R.compose(R.map(x => x.id), R.map(x => x.toJSON()))(pods)
        res(ids)
      })
    R.compose(R.chain(deletePods), R.chain(flatPods), findAllPods)().fork(
      rej,
      res
    )
  })
