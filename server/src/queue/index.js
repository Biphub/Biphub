import AsyncQueue from './async-queue'

/**
 * Dependent env variable: MESSAGE_QUEUE. It can be either memory | rabbit
 */
const createQueue = worker => {
  if (process.env.MESSAGE_QUEUE === 'memory') {
    return new AsyncQueue(worker)
  }
  return null
}

export default {
  createQueue
}
