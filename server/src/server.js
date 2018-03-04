import { exec } from 'child_process'
import path from 'path'
import R from 'ramda'
import graphqlHTTP from 'express-graphql'
import fluture from 'fluture'
import express from 'express'
import compression from 'compression'
import appRoot from 'app-root-path'
import session from 'express-session'
import bodyParser from 'body-parser'
import cors from 'cors'
import passport from 'passport'
import errorHandler from 'errorhandler'
import lusca from 'lusca'
import flash from 'express-flash'
import expressValidator from 'express-validator'
import morgan from 'morgan'
import logger from './logger'
import { default as config } from './config'
import { sequelize } from './models'
import routes from './controllers/routes'
import pipelineWorker from './workers/pipeline.worker'
import Queue from './queue'
import Schema from './graphql/schema'

const Future = fluture.Future

/**
 * Bootstrap express app context with various things
 * Typical REST endpoints
 * Graphql Endpoint
 * @param {e.Application} app
 */
const bootstrapExpress = app =>
  Future((rej, res) => {
    logger.info('START - Express setup')
    const SessionStore = require('express-session-sequelize')(session.Store)
    const sequelizeSessionStore = new SessionStore({ db: sequelize })
    app.use(
      session({
        resave: true,
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET,
        store: sequelizeSessionStore,
      }),
    )
    app.set('port', process.env.PORT || 3000)
    // app.set('view engine', 'pug')
    app.use(compression())
    app.use(cors())
    app.use(morgan('combined'))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(expressValidator())
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())
    app.use(lusca.xframe('SAMEORIGIN'))
    app.use(lusca.xssProtection(true))
    // Setting locals user
    app.use((req, res, next) => {
      res.locals.user = req.user
      next()
    })
    app.use((req, res, next) => {
      // After successful login, redirect back to the intended page
      if (
        !req.user &&
        req.path !== '/login' &&
        req.path !== '/signup' &&
        !req.path.match(/^\/auth/) &&
        !req.path.match(/\./)
      ) {
        req.session.returnTo = req.path
      } else if (req.user && req.path === '/account') {
        req.session.returnTo = req.path
      }
      next()
    })
    const staticConfig = {
      maxAge: 31557600000,
    }
    // Main statics
    app.use(express.static(appRoot.resolve('/src/public'), staticConfig))
    logger.info('main /src/public static is set!')
    console.log('checking  ', appRoot.resolve('pods'))
    console.log(path.join(__dirname, 'pods'))
    app.use('/pods', express.static(appRoot.resolve('/pods'), staticConfig))
    logger.info('staging pod /pod/staging')
    // Routes!
    app.use(routes())

    // Graphql
    const root = {
      hello: () => 'Hello from Bipflow!',
    }
    app.use(
      '/graphql',
      graphqlHTTP({
        schema: Schema,
        rootValue: root,
        pretty: true,
        graphiql: true,
      }),
    )

    // Error Handler. Provides full stack - remove for production
    app.use(errorHandler())
    logger.info('END - Express setup')
    res(app)
  })

/**
 * Binds queue to the current app context
 * @param app
 */
const setupQueue = app =>
  Future((rej, res) => {
    logger.info('START - Queue setup')
    const q = Queue.createQueue(pipelineWorker.executeTask)
    console.log('setting up', Queue)
    if (!q) {
      return rej(false)
    }
    // Bind queue to application context
    app.queue = q
    // Binds queue to request as well
    app.use((req, res, next) => {
      req.queue = q
      next()
    })
    logger.info('END - Queue setup')
    res(app)
  })

// Move this to actual seeders folder
const seedDb = app =>
  Future((rej, res) => {
    const env = process.env.NODE_ENV
    if (env === 'development' || env === 'test') {
      exec('sequelize db:seed:all', (err, stdout, stderr) => {
        if (err) {
          logger.info('Skipping migration!')
          return res(app)
        }
        logger.info(stdout)
        logger.info(stderr)
        res(app)
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
const connectDb = app =>
  Future((rej, res) => {
    // 3. Set up sequelize
    const env = process.env.NODE_ENV
    const syncOptions = {
      force: env !== 'production',
    }
    sequelize
      .authenticate(syncOptions)
      .then(migrator => {
        return res(app)
      })
      .catch(e => {
        console.error(e)
        return rej(e)
      })
  })

// Initiating app so it's available throughout the ramda compose
const initiateExpress = () =>
  Future((rej, res) => {
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
export const start = R.compose(
  R.chain(bootstrapExpress),
  R.chain(setupQueue),
  R.chain(connectDb),
  R.chain(initiateExpress),
  () => {
    return Future((rej, res) => {
      // 1. Set up config from dotenv
      config.setup()
      logger.info('Main config setup!')
      res(null)
    })
  },
)
