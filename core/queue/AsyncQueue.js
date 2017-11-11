import {queue} from 'async'

/**
 * Async queue for inmemory messaging system
 */
export class AsyncQueue {
  constructor(worker) {
    this.queue = queue(worker, 1)
  }
  /**
   * Fix any type!
   * @param task
   * @param {Function} callback
   */
  push(task, callback) {
    this.queue.push(task, callback)
  }
}
