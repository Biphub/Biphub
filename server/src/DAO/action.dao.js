/*
Const createAction = (action: ActionInstance, pod: PodInstance) => Future((rej, res) => {
  models.Action.create(action)
    .then((action: ActionModel) => {
      action.setPod(pod)
      res(action)
    })
    .catch(rej)
})

const createManyActions = (data: JSON, pod: PodInstance) => Future((rej, res) => {
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

export default {
  createManyActions
}
*/

export default null
