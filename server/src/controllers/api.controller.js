import * as graph from 'fbgraph'

/**
 * GET /api
 * List of API examples.
 */
export const getApi = (req, res) => {
  res.render('api/index', {
    title: 'API Examples'
  })
}

/**
 * GET /api/facebook
 * Facebook API example.
 */
export const getFacebook = (req, res, next) => {
  const token = req.user.tokens.find(token => token.kind === 'facebook')
  graph.setAccessToken(token.accessToken)
  graph.get(`${req.user.facebook}?fields=id,name,email,first_name,last_name,gender,link,locale,timezone`, (err, results) => {
    if (err) {
      return next(err)
    }
    res.render('api/facebook', {
      title: 'Facebook API',
      profile: results
    })
  })
}
