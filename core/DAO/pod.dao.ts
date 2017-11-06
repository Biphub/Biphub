import * as R from 'ramda'
import * as fluture from 'fluture'
import { models } from '../models'
import { AppContext } from '../server'
import { getAllManifests } from '../bridge/node2node'
import { PodModel } from "../models/Pod.model";
import { Applicative } from "ramda";

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
  const fullPod = R.merge({ Actions: formatActions(actions) }, podProps) as any
  models.Pod.create(
    fullPod,
    {
      include: [ models.Action ]
    }
  )
    .then((pod: PodModel) => {
      res(pod)
    })
    .catch((e: Error) => rej(e))
})

/**
 * install all pods
 */
export const installPods = (app: AppContext) => Future((rej, res) => {
  R.traverse(Future.of as any, createPod, getAllManifests())
    .fork(
      (e: Error) => rej(e),
      (pods: Array<PodModel>) => res(pods)
    )
})

export const findPodsWithNames = (names: Array<string>) => Future((rej, res) => {
  models.Pod.findAll<PodModel>({
    where: {
      name: names
    }
  })
    .then(res)
    .catch(rej)
})
