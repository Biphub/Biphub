import * as R from 'ramda'
import * as graphqlHTTP from 'express-graphql'
import * as fluture from 'fluture'
import * as express from 'express'
import * as compression from 'compression'
import * as appRoot from 'app-root-path'
import * as session from 'express-session'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import { logger } from './logger'
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
import { default as Schema } from './graphql/schema'
const Future = fluture.Future

export interface AppContext extends express.Application {
  queue: Queue.AppQueue
}

export interface AppRequest extends express.Request {
  queue: Queue.AppQueue
}

const initHotReloading = () => {

}

/**
 *
 * @param {e.Application} app
 */
const initializePods = (app: express.Application) => Future((rej, res) => {
  installPods(app).fork(
    rej,
    () => res(app)
  )
})

/**
 * Bootstrap express app context with various things
 * Typical REST endpoints
 * Graphql Endpoint
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
  app.use(cors())
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
  const staticConfig = {
    maxAge: 31557600000
  }
  // Main statics
  app.use(express.static(appRoot.resolve('/core/public'), staticConfig))
  logger.info('main /core/public static is set!')
  app.use(express.static(appRoot.resolve('/pods'), staticConfig))
  logger.info('staging pod /pod/staging')
  // Routes!
  app.use(routes())

  // Graphql
  const root = {
    hello: () => 'Hello from Bipflow!'
  }
  app.use('/graphql', graphqlHTTP({
    schema: Schema,
    rootValue: root,
    pretty: true,
    graphiql: true
  }))

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
    req: AppRequest, res: express.Response, next: express.NextFunction
  ) => {
    req.queue = q
    next()
  })
  res(app)
})

// Move this to actual seeders folder
const seedDb = (app: express.Application) => Future((rej, res) => {
  const env = process.env.NODE_ENV
  if (env === 'development' || env === 'test') {
    models.Pipeline.bulkCreate([
      {
        title: 'test pipeline',
        description: 'this is just for testing!',
        entryApp: 'biphub-pod-fake1',
        entryType: 'webhook',
        sequence: {
          'webhook': {
            podName: 'biphub-pod-fake1',
            graph: {
              x: 10,
              y: 210
            },
            next: {
              'post-fake-message': {
                podName: 'biphub-pod-fake1',
                graph: {
                  x: 20,
                  y: 50
                },
                next: {
                  'create-fake-issue': {
                    podName: 'biphub-pod-fake2',
                    graph: {
                      x: 40,
                      y: 10
                    }
                  }
                }
              },
              'test-move-issue': {
                podName: 'biphub-pod-fake2',
                graph: {
                  x: 10,
                  y: 60
                },
                next: {
                  'search-channel': {
                    podName: 'biphub-pod-fake1',
                    graph: {
                      z: 10,
                      x: 20
                    }
                  }
                }
              },
              'deleteFakeMessage': {
                podName: 'biphub-pod-fake1',
                graph: 1
              }
            }
          }
        }
      }
    ]).then(() => {
      res(app)
    }).catch((e) => {
      rej(e)
    })
  } else {
    console.info('skipping migration because you are in production mode')
    res(app)
  }
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
      return res(app)
    })
    .catch(e => {
      console.error(e)
      return rej(e)
    })
})

// Initiating app so it's available throughout the ramda compose
const initiateExpress = () => Future((rej, res) => {
  const app = express()
  if (!R.isEmpty(app)) {
    logger.info('Initiated app in start!')
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
    R.chain(seedDb),
    R.chain(connectDb),
    R.chain(initiateExpress),
    () => {
      return Future((rej, res) => {
        // 1. Set up config from dotenv
        config.setup()
        logger.info('Main config setup!')
        // 2. Set up passport
        // TODO: Fix this
        passportConfig.setupPassport()
        logger.info('Passport setup!')
        res(null)
      })
    }
  )
