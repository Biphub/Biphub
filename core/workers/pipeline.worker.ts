import * as R from 'ramda'
import { Task } from '../queue/index'
import { findPipeline } from '../DAO/pipeline.dao'

/**
 *
 * @param task
 */
export const executeTask = (task: Task, cb: Function) => {
  const podName = R.propOr(null, 'name', task)
  const body = R.propOr(null, 'body', task)
  console.log('executing task! ', task)
  if (!podName || !body) {
    throw new Error('Invalid payload while executing queue task')
  }
  findPipeline(podName)
    .fork(
      (e) => {
        console.error(e)
        cb()
      },
      (pipeline) => {
        console.log('found a pipeline in execute task! ', pipeline)
        cb()
      }
    )
}
