/**
 * Module dependencies.
 */
import * as express from 'express'
import * as compression from 'compression'  // compresses requests
import * as session from 'express-session'
import * as bodyParser from 'body-parser'
import * as logger from 'morgan'
import * as passport from 'passport'
import * as errorHandler from 'errorhandler'
import * as lusca from 'lusca'
import * as flash from 'express-flash'
import * as path from 'path'
import { default as config } from './config'
import expressValidator = require('express-validator')
import { default as models } from './models'
const SessionStore = require('express-session-sequelize')(session.Store)

config.setup() // <- Ths encourages building impure functions

/**
 * Controllers (route handlers).
 */
import { default as routes } from './routes'

/**
 * Create Express server.
 */
const app = express()
console.log('checking config ', process.env.DATABASE_TYPE)

// Initializes sequelize
models.sequelize.sync().then(() => console.log('Initialised seqeulize'))
const sequelizeSessionStore = new SessionStore({ db: models.sequelize })
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: sequelizeSessionStore
}))
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug')
app.use(compression())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressValidator())
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))
app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
    req.path !== '/login' &&
    req.path !== '/signup' &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)) {
    req.session.returnTo = req.path
  } else if (req.user &&
    req.path === '/account') {
    req.session.returnTo = req.path
  }
  next()
})
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }))

// API examples routes.

// Routes!
app.use(routes())

// Error Handler. Provides full stack - remove for production
app.use(errorHandler())
// Start Express server.
app.listen(app.get('port'), () => {
  console.log(('  App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'))
  console.log('  Press CTRL-C to stop\n')
})

// TODO: Fix below for unit testing
module.exports = app
