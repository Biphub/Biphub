/**
 * Module dependencies.
 */
import * as R from 'ramda';
import * as future from 'ramda-future';
import * as express from 'express';
import * as compression from 'compression';  // compresses requests
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as errorHandler from 'errorhandler';
import * as lusca from 'lusca';
import * as mongo from 'connect-mongo';
import * as flash from 'express-flash';
import * as path from 'path';
import * as passport from 'passport';
import { default as config } from './config';
import { default as database } from './database';
import expressValidator = require('express-validator');
import * as models from './models';
const SessionStore = require('express-session-sequelize')(session.Store);

config.setup(); // <- This encourages building impure functions
console.log('checking models ');

/**
 * Controllers (route handlers).
 */
import * as homeController from './controllers/home.controller';
import * as userController from './controllers/user.controller';
import * as apiController from './controllers/api.controller';
import * as contactController from './controllers/contact.controller';

/**
 * API keys and Passport configuration.
 */
import * as passportConfig from './config/passport';

/**
 * Create Express server.
 */
const app = express();
console.log('checking config ', process.env.DATABASE_TYPE);

// Initializes sequelize
models.sequelize.sync().then(() => console.log('Initialised seqeulize'));
const sequelizeSessionStore = new SessionStore({ db: models.sequelize });
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: sequelizeSessionStore
}));
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
    req.path !== '/login' &&
    req.path !== '/signup' &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user &&
    req.path == '/account') {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
// Primary app routes.
app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);
// API examples routes.
app.get('/api', apiController.getApi);
app.get('/api/facebook', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);


// OAuth authentication routes. (Sign in)
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});

// Error Handler. Provides full stack - remove for production
app.use(errorHandler());
// Start Express server.
app.listen(app.get('port'), () => {
  console.log(('  App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

// TODO: Fix below for unit testing
module.exports = app;