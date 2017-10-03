import { AsyncQueue } from './AsyncQueue'

export interface Task {
  name: string,
  body: JSON,
}

export interface AppQueue {
  push: (task: Task, cb: Function) => void
}

/**
 * Dependent env variable: MESSAGE_QUEUE. It can be either memory | rabbit
 */
export const createQueue = (worker: Function) => {
  if (process.env.MESSAGE_QUEUE === 'memory') {
    return new AsyncQueue(worker)
  }
  return null
}
