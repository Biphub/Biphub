import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { default as accountRoutes } from './account'
import * as passportConfig from '../config/passport.config'
import * as homeController from '../controllers/home.controller'
import * as contactController from '../controllers/contact.controller'
import * as apiController from '../controllers/api.controller'

export default () => {
  const api = Router()
  // Primary app routes.
  api.get('/', homeController.index)
  api.get('/contact', contactController.getContact)
  api.post('/contact', contactController.postContact)
  api.get('/api', apiController.getApi)
  api.get('/api/facebook', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook)
  // Primary account routes. -> /account
  api.use(accountRoutes())

  // OAuth authentication routes. (Sign in)
  api.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }))
  api.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
    res.redirect(req.session.returnTo || '/')
  })

  return api
}
