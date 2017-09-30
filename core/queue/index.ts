import { AsyncQueue } from './AsyncQueue'

/**
 * Dependent env variable: MESSAGE_QUEUE. It can be either memory | rabbit
 */
export const createQueue = (worker: Function) => {
  if (process.env.MESSAGE_QUEUE === 'memory') {
    return new AsyncQueue(worker)
  }
  return null
}
