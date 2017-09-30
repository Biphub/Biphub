import * as R from 'ramda'
import { Response, Request, NextFunction } from 'express'

/**
 * GET /webhooks*
 * List of API examples.
 */
export const postWebhooks = (req: Request, res: Response) => {
  const splitComponents = R.compose(
    (comps: Array<string>) => ({
      root: comps[0],
      pod: comps[1],
    }),
    // Split by /
    R.split('/'),
    // Removes initial / if it exists
    R.replace(/^\//, ''),
  )
  /**
  // TODO: Fix below
  const getPath = R.ifElse(
    R.not(R.isEmpty(R.match(/^\/*webhooks\/[\w\d]+\//g))),
    splitComponents,
    () => null,
  ) **/
  req.queue.push({ name: `new stuff from webhook! ${splitComponents(req.path).pod}` }, () => {})
  res.json({
    ok: splitComponents(req.path),
  })
}
