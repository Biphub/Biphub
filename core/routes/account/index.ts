import { Request, Response, Router } from 'express'
import * as userController from '../../controllers/user.controller'
import * as passportConfig from '../../config/passport.config'

export default () => {
  const api = Router()
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
  return api
}
