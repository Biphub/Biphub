import {Router} from 'express'
import passport from 'passport'
import * as passportConfig from '../config/passport.config'
import * as homeController from '../controllers/home.controller'
import * as contactController from '../controllers/contact.controller'
import * as apiController from '../controllers/api.controller'
import * as pipelineController from '../controllers/pipeline.controller'
import * as userController from '../controllers/user.controller'
import * as webhooksContoller from '../controllers/webhooks.controller'

export default () => {
  const api = Router()
  // Primary app routes.
  api.get('/', homeController.index)
  api.get('/contact', contactController.getContact)
  api.post('/contact', contactController.postContact)
  api.get('/api', apiController.getApi)
  api.get('/api/facebook', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook)
  // Account routes. -> /account
  api.get('/account', passportConfig.isAuthenticated, userController.getAccount)
  api.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile)
  api.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword)
  api.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount)
  api.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink)
  api.get('/account/login', userController.getLogin)
  api.post('/account/login', userController.postLogin)
  api.get('/account/logout', userController.logout)
  api.get('/account/forgot', userController.getForgot)
  api.post('/account/forgot', userController.postForgot)
  api.get('/account/reset/:token', userController.getReset)
  api.post('/account/reset/:token', userController.postReset)
  api.get('/account/signup', userController.getSignup)
  api.post('account//signup', userController.postSignup)

  // Pipeline routes -> /pipeline
  api.get('/pipeline', (req, res) => {
    res.json({test: 'test success'})
  })
  api.post('/pipeline', pipelineController.create)

  // OAuth authentication routes. (Sign in)
  api.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email', 'public_profile']}))
  api.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/login'}), (req, res) => {
    res.redirect(req.session.returnTo || '/')
  })

  // Webhooks
  api.post('/webhooks*', webhooksContoller.postWebhooks)

  return api
}
