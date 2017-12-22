import queue from 'async/queue'
import logger from '../logger'

/**
 * Async queue for inmemory messaging system
 */
class AsyncQueue {
  constructor(worker) {
    this.queue = queue(worker, 1)
    this.queue.drain = () => {
      this.count = 0
      logger.info('Drained all current tasks')
    }
  }
  /**
   * Fix any type!
   * @param task
   * @param {Function} callback
   */
  push(task, callback) {
    // Inc number of tasks
    this.count += 1
    logger.info(`Received a new task: number of tasks is ${this.count}`)
    this.queue.push(task, callback)
  }
}

export default AsyncQueue
