import * as AsyncType from '@types/async'
import { queue } from 'async'

/**
 * Async queue for inmemory messaging system
 */
export class AsyncQueue {
  queue: AsyncType
  constructor (worker: Function | AsyncType.AsyncWorker) {
    this.queue = queue(worker, 1)
  }
  /**
   * Fix any type!
   * @param task
   * @param {Function} callback
   */
  push (task: any, callback: Function) {
    this.queue.push(task, callback)
  }
}
