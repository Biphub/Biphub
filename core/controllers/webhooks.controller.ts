import * as R from 'ramda'
import { Response, Request, NextFunction } from 'express'

/**
 * GET /webhooks*
 * List of API examples.
 */
export const postWebhooks = (req: Request, res: Response) => {
  const getPathComponents = R.compose(
    (comps: Array<string>) => ({
      root: comps[0],
      pod: comps[1],
    }),
    // Split by /
    R.split('/'),
    // Removes initial / if it exists
    R.replace(/^\//, ''),
  )
  res.json({
    ok: getPathComponents(req.path),
  })
}
