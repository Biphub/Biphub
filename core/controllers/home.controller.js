"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * GET /
 * Home page.
 */
exports.index = function (req, res) {
    console.log('checking req ', req.user);
    res.render('home', {
        title: 'Home'
    });
};
