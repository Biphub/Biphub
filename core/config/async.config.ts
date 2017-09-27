/**
 * Async queue config
 * @param NODE_ENV
 */
const getPodQueueConfig = (NODE_ENV) => {
  if (NODE_ENV === 'production') {
    return {}
  } else if (NODE_ENV === 'development') {

  } else {
    // Testing
    return {}
  }
}