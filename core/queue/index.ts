import * as AsyncQueue from './AsyncQueue';

/**
 * Dependent env variable: MESSAGE_QUEUE. It can be either memory | rabbit
 */
export const getQueue = () => {
  console.log('checking message queue ', process.env.MESSAGE_QUEUE, '  pr ', process.env.DATABASE_TYPE)
  if (process.env.MESSAGE_QUEUE === 'memory') {
    return AsyncQueue
  }
  return null
}
