"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var R = require("ramda");
var fluture = require("fluture");
var express = require("express");
var compression = require("compression"); // compresses requests
var session = require("express-session");
var bodyParser = require("body-parser");
var logger = require("morgan");
var passport = require("passport");
var errorHandler = require("errorhandler");
var lusca = require("lusca");
var flash = require("express-flash");
var path = require("path");
var passportConfig = require("./config/passport.config");
var config_1 = require("./config");
var expressValidator = require("express-validator");
var models_1 = require("./models");
var routes_1 = require("./routes");
var Future = fluture.Future;
var connectDb = function () { return Future(function (rej, res) {
    // 3. Set up sequelize
    models_1.default.sequelize.sync({ force: process.env.NODE_ENV === 'test' })
        .then(function () {
        console.info('Initialised seqeulize');
        res(null);
    })
        .catch(function (e) {
        console.error(e);
        rej(e);
    });
}); };
var bootstrapExpress = function () { return Future(function (rej, res) {
    // 4. Bootstrap express
    var app = express();
    var SessionStore = require('express-session-sequelize')(session.Store);
    var sequelizeSessionStore = new SessionStore({ db: models_1.default.sequelize });
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
    app.use(function (req, res, next) {
        res.locals.user = req.user;
        next();
    });
    app.use(function (req, res, next) {
        // After successful login, redirect back to the intended page
        if (!req.user &&
            req.path !== '/login' &&
            req.path !== '/signup' &&
            !req.path.match(/^\/auth/) &&
            !req.path.match(/\./)) {
            req.session.returnTo = req.path;
        }
        else if (req.user &&
            req.path === '/account') {
            req.session.returnTo = req.path;
        }
        next();
    });
    app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
    // API examples routes.
    // Routes!
    app.use(routes_1.default());
    // Error Handler. Provides full stack - remove for production
    app.use(errorHandler());
    res(app);
}); };
/**
 * Starts the server
 * Required environment variables
 * Critical:
 * NODE_ENV: development | production | test
 */
exports.start = R.compose(R.chain(bootstrapExpress), R.chain(connectDb), function () {
    return Future(function (rej, res) {
        // 1. Set up config from dotenv
        config_1.default.setup();
        // 2. Set up passport
        passportConfig.setupPassport();
        res(null);
    });
});
exports.stop = function (app) { return app.close(); };
