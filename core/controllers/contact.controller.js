"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
    }
});
/**
 * GET /contact
 * Contact form page.
 */
exports.getContact = function (req, res) {
    res.render('contact', {
        title: 'Contact'
    });
};
/**
 * POST /contact
 * Send a contact form via Nodemailer.
 */
exports.postContact = function (req, res) {
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('message', 'Message cannot be blank').notEmpty();
    var errors = req.validationErrors();
    console.log('checking errors ', errors);
    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/contact');
    }
    var mailOptions = {
        to: 'your@email.com',
        from: req.body.name + " <" + req.body.email + ">",
        subject: 'Contact Form',
        text: req.body.message
    };
    transporter.sendMail(mailOptions, function (err) {
        console.log('email send err ', err);
        if (err) {
            req.flash('errors', { msg: err.message });
            return res.redirect('/contact');
        }
        req.flash('success', { msg: 'Email has been sent successfully!' });
        res.redirect('/contact');
    });
};
