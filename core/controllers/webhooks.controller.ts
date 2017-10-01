import * as R from 'ramda'
import { Response, Request } from 'express'

/**
 * GET /webhooks*
 * List of API examples.
 */
export const postWebhooks = (req: Request, res: Response) => {
  const getPathComponents = R.memoize(R.compose(
    (comps: Array<string>) => ({
      root: comps[0],
      pod: comps[1]
    }),
    // Split by /
    R.split('/'),
    // Removes initial / if it exists
    R.replace(/^\//, '')
  ))
  console.log('req queue check ', req.queue.push)
  req.queue.push({
    name: getPathComponents(req.path).pod,
    body: req.body
  }, () => {
    console.info('Webhook route has pub')
  })
  res.json({
    ok: getPathComponents(req.path)
  })
}
