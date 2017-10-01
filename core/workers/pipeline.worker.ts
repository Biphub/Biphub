import { Task } from '../queue/index'

/**
 *
 * @param task
 */
export const executeTask = (task: Task, cb: Function) => {
  console.log('worker received a task! ', task)
  cb()
}
