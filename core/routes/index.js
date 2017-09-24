"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var passport = require("passport");
var account_1 = require("./account");
var pipeline_1 = require("./pipeline");
var passportConfig = require("../config/passport.config");
var homeController = require("../controllers/home.controller");
var contactController = require("../controllers/contact.controller");
var apiController = require("../controllers/api.controller");
exports.default = function () {
    var api = express_1.Router();
    // Primary app routes.
    api.get('/', homeController.index);
    api.get('/contact', contactController.getContact);
    api.post('/contact', contactController.postContact);
    api.get('/api', apiController.getApi);
    api.get('/api/facebook', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);
    // Account routes. -> /account
    api.use(account_1.default());
    // Pipeline routes -> /pipeline
    api.use(pipeline_1.default());
    // OAuth authentication routes. (Sign in)
    api.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
    api.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function (req, res) {
        res.redirect(req.session.returnTo || '/');
    });
    return api;
};
