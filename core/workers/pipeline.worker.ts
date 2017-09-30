interface Task {
  name: string,
  body: JSON,
}
/**
 *
 * @param task
 */
export const executeTask = (task: Task, cb: Function) => {
  console.log('worker received a task! ', task)
  cb()
}
