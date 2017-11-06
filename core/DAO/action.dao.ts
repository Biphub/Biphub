import * as R from 'ramda'
import * as fluture from 'fluture'
import models from '../models'
import {ActionInstance} from '../models/Action.model'
import { PodInstance } from '../models/Pod.model'
const Future = fluture.Future

const createAction = (action: ActionInstance, pod: PodInstance) => Future((rej, res) => {
  models.Action.create(action)
    .then((action) => {
      action.setPod(pod)
      res(action)
    })
    .catch(rej)
})

/**
 * Currently it is assuming data will always be formatted in the follow way
 * {
 *   fake_message: {...},
 *   incoming_hooks: {...},
 * }
 *
 * fake_message and incoming_hooks becomes unique identifier of each action
 * @param data
 * @param pod
 */
export const createManyActions = (data: JSON, pod: PodInstance) => Future((rej, res) => {
  const formatActions = R.compose(
    ({ keys, x }) => {
      return R.reduce((acc, key: string) => {
        const action = R.merge({ name: key }, R.propOr({}, key, x))
        return R.append(action, acc)
      }, [], keys)
    },
    (x) => {
      const keys = R.keys(x)
      return { keys, x }
    }
  )
  R.traverse(Future.of, createAction, formatActions(data))
    .fork(
      (e: Error) => {
        console.error('failed to create actions ', e)
        rej(e)
      },
      (actions: Array<ActionInstance>) => {
        res(actions)
      })

})
