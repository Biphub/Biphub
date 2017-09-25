import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { default as accountRoutes } from './account'
import { default as pipelineRoutes } from './pipeline'
import * as passportConfig from '../config/passport.config'
import * as homeController from '../controllers/home.controller'
import * as contactController from '../controllers/contact.controller'
import * as apiController from '../controllers/api.controller'
import * as pipelineController from '../controllers/pipeline.controller'

export default () => {
  const api = Router()
  // Primary app routes.
  api.get('/', homeController.index)
  api.get('/contact', contactController.getContact)
  api.post('/contact', contactController.postContact)
  api.get('/api', apiController.getApi)
  api.get('/api/facebook', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook)
  // Account routes. -> /account
  api.use(accountRoutes())

  // Pipeline routes -> /pipeline
  api.get('/pipeline', (req: Request, res: Response) => {
    res.json({ test: 'test success' })
  })
  api.post('/pipeline', pipelineController.create)

  // OAuth authentication routes. (Sign in)
  api.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }))
  api.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
    res.redirect(req.session.returnTo || '/')
  })

  return api
}
