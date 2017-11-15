import * as R from 'ramda'
import logger from '../logger'

/**
 * GET /webhooks*
 * List of API examples.
 */
export const postWebhooks = (req, res) => {
  const getPathComponents = R.memoize(R.compose(
    comps => ({
      root: comps[0],
      pod: comps[1]
    }),
    // Split by /
    R.split('/'),
    // Removes initial / if it exists
    R.replace(/^\//, '')
  ))
  const name = R.propOr(null, 'pod', getPathComponents(req.path))
  const body = R.propOr(null, 'body', req)
  if (!name || !body) {
    logger.error('Incorrect approach to webhook endpoint name:', name, 'body:', body)
    return res.json({
      ok: false
    })
  }
  console.log('received stuff!')
  req.queue.push({
    name: getPathComponents(req.path).pod,
    body: req.body
  }, () => {
    logger.info('End: Webhook Task', name, 'has finished')
  })
  res.json({
    ok: getPathComponents(req.path)
  })
}
