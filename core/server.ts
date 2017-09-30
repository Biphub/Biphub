import * as R from 'ramda'
import * as fluture from 'fluture'
import * as express from 'express'
import * as compression from 'compression'
import * as session from 'express-session'
import * as bodyParser from 'body-parser'
import * as logger from 'morgan'
import * as passport from 'passport'
import * as errorHandler from 'errorhandler'
import * as lusca from 'lusca'
import * as flash from 'express-flash'
import * as path from 'path'
import * as passportConfig from './config/passport.config'
import { installPods } from './DAO/pod.dao'
import { default as config } from './config'
import expressValidator = require('express-validator')
import { default as models } from './models'
import { default as routes } from './routes'
import { executeTask } from './workers/pipeline.worker'
import * as Queue from './queue'
const Future = fluture.Future

/**
 *
 * @param {e.Application} app
 */
const initializePods = (app: express.Application) => Future((rej, res) => {
  console.error('testing!!zz')
  installPods().fork(
    rej,
    () => res(app)
  )
})

/**
 * Bootstrap express app context with various things
 * @param {e.Application} app
 */
const bootstrapExpress = (app: express.Application) => Future((rej, res) => {
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
 * Binds queue to the current app context
 * @param {e.Application} app
 */
const setupQueue = (app: express.Application) => Future((rej, res) => {
  const q = Queue.createQueue(executeTask)
  if (!q) {
    return rej(false)
  }
  // Bind queue to application context
  app.queue = q
  // Binds queue to request as well
  app.use((
    req: express.Request, res: express.Response, next: express.NextFunction
  ) => {
    req.queue = q
    next()
  })
  res(app)
})

/**
 * Connect to db using Sequelize.
 * @param {e.Application} app
 */
const connectDb = (app: express.Application) => Future((rej, res) => {
  // 3. Set up sequelize
  const env = process.env.NODE_ENV
  const syncOptions = {
    force: env !== 'production'
  }
  models.sequelize.sync(syncOptions)
    .then(() => {
      console.info('Initialised seqeulize')
      res(app)
    })
    .catch(e => {
      console.error(e)
      rej(e)
    })
})

// Initiating app so it's available throughout the ramda compose
const initiateExpress = () => Future((rej, res) => {
  const app = express()
  if (!R.isEmpty(app)) {
    console.info('Initiated app in start!')
    res(app)
  }
})

/**
 * Starts the server
 * Required environment variables
 * Critical:
 * NODE_ENV: development | production | test
 */
export const start =
  R.compose(
    R.chain(initializePods),
    R.chain(bootstrapExpress),
    R.chain(setupQueue),
    R.chain(connectDb),
    R.chain(initiateExpress),
    () => {
      return Future((rej, res) => {
        // 1. Set up config from dotenv
        config.setup()

        // 2. Set up passport
        // TODO: Fix this
        passportConfig.setupPassport()
        res(null)
      })
    }
  )

export const stop = (app: express.Application) => app.close()
