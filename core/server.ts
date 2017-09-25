import * as R from 'ramda'
import * as fluture from 'fluture'
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
import * as passportConfig from './config/passport.config'
import { default as config } from './config'
import expressValidator = require('express-validator')
import { default as models } from './models'
import { default as routes } from './routes'
const Future = fluture.Future

const connectDb = () => Future((rej, res) => {
  // 3. Set up sequelize
  models.sequelize.sync()
    .then(() => {
      console.info('Initialised seqeulize')
      res(null)
    })
    .catch(e => {
      console.error(e)
      rej(e)
    })
})

const bootstrapExpress = () => Future((rej, res) => {
  // 4. Bootstrap express
  const app = express()
  const SessionStore = require('express-session-sequelize')(session.Store)
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

  // Routes!
  app.use(routes())

  // Error Handler. Provides full stack - remove for production
  app.use(errorHandler())
  res(app)
})

/**
 * Starts the server
 * Required environment variables
 * Critical:
 * NODE_ENV: development | production | test
 */
export const start =
  R.compose(
    R.chain(bootstrapExpress),
    R.chain(connectDb),
    () => {
      return Future((rej, res) => {
        // 1. Set up config from dotenv
        config.setup()
        // 2. Set up passport
        passportConfig.setupPassport()
        res(null)
      })
    }
  )

export const stop = (app: express.Application) => app.close()
