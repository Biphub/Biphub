import * as AsyncType from '@types/async'
import { queue } from 'async'

const createQueue = (worker: AsyncType.AsyncWorker) => {

  return queue(worker, 1)
}

const push = ( queue: AsyncType.AsyncQueue, task: JSON, callback: Function) =>
  queue.push(task, callback)

export {
  createQueue,
  push
}
