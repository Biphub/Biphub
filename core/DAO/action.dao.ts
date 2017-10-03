import * as R from 'ramda'
import * as fluture from 'fluture'
import models from '../models'
const Future = fluture.Future

const createAction = (action, pod) => Future((rej, res) => {
  console.log('checking action before creating ', action)
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
 */
export const createManyActions = (data, pod) => Future((rej, res) => {
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
  R.traverse(Future.of, createAction, formatActions(data, pod))
    .fork(
      (e) => {
        console.error('failed to create actions ', e)
        rej(e)
      },
      (actions) => {
        console.log('created actions!')
        res(actions)
      })

})