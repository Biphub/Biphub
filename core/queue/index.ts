import { AsyncQueue } from './AsyncQueue';

/**
 * Dependent env variable: MESSAGE_QUEUE. It can be either memory | rabbit
 */
export const createQueue = (worker: Function) => {
  console.log('checking message queue ', process.env.MESSAGE_QUEUE, '  pr ', process.env.DATABASE_TYPE)
  if (process.env.MESSAGE_QUEUE === 'memory') {
    return new AsyncQueue(worker)
  }
  return null
}
