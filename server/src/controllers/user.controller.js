import crypto from 'crypto'
import async from 'async'
import nodemailer from 'nodemailer'
import passport from 'passport'
import {models} from '../models'

export const getLogin = (req, res) => {
  if (req.user) {
    return res.redirect('/')
  }
  res.render('account/login', {
    title: 'Login'
  })
}

export const postLogin = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail()
  req.assert('password', 'Password cannot be blank').notEmpty()
  req.sanitize('email').normalizeEmail({gmail_remove_dots: false})

  const errors = req.validationErrors()

  if (errors) {
    req.flash('errors', errors)
    return res.redirect('/login')
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      req.flash('errors', info.message)
      return res.redirect('/login')
    }
    req.logIn(user, err => {
      if (err) {
        return next(err)
      }
      req.flash('success', {msg: 'Success! You are logged in.'})
      res.redirect(req.session.returnTo || '/')
    })
  })(req, res, next)
}

export const logout = (req, res) => {
  req.logout()
  res.redirect('/')
}

export const getSignup = (req, res) => {
  if (req.user) {
    return res.redirect('/')
  }
  res.render('account/signup', {
    title: 'Create Account'
  })
}

export const postSignup = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail()
  req.assert('password', 'Password must be at least 4 characters long')
    .len({min: 4})
  req.assert('confirmPassword', 'Passwords do not match')
    .equals(req.body.password)
  req.sanitize('email').normalizeEmail({
    gmail_remove_dots: false
  })

  const errors = req.validationErrors()

  if (errors) {
    req.flash('errors', errors)
    return res.redirect('/signup')
  }
  models.User.findOrCreate({
    where: {
      email: req.body.email,
      password: req.body.password
    }
  }).spread((userResult, created) => {
    if (created) {
      req.logIn(userResult.dataValue, err => {
        if (err) {
          console.error('login failed! ', err)
          return next(err)
        }
        res.redirect('/')
      })
    } else {
      return next()
    }
  }) // End spread
}

export const getAccount = (req, res) => {
  res.render('account/profile', {
    title: 'Account Management'
  })
}

export const postUpdateProfile = (req, res, next) => {
  req.assert('email', 'Please enter a valid email address.').isEmail()
  req.sanitize('email').normalizeEmail({gmail_remove_dots: false})

  const errors = req.validationErrors()

  if (errors) {
    req.flash('errors', errors)
    return res.redirect('/account')
  }

  models.User.findById(req.user.id, (err, user) => {
    if (err) {
      return next(err)
    }
    user.email = req.body.email || ''
    user.firstName = req.body.name || ''
    user.gender = req.body.gender || ''
    user.location = req.body.location || ''
    user.website = req.body.website || ''
    user.save(err => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', {msg: `The email address you have entered is
           already associated with an account.`})
          return res.redirect('/account')
        }
        return next(err)
      }
      req.flash('success', {msg: 'Profile information has been updated.'})
      res.redirect('/account')
    })
  })
}

export const postUpdatePassword = (req, res, next) => {
  req.assert('password', 'Password must be at least 4 characters long')
    .len({min: 4})
  req.assert('confirmPassword', 'Passwords do not match')
    .equals(req.body.password)

  const errors = req.validationErrors()

  if (errors) {
    req.flash('errors', errors)
    return res.redirect('/account')
  }

  models.User.findById(req.user.id, (err, user) => {
    if (err) {
      return next(err)
    }
    user.password = req.body.password
    user.save(err => {
      if (err) {
        return next(err)
      }
      req.flash('success', {msg: 'Password has been changed.'})
      res.redirect('/account')
    })
  })
}

export const postDeleteAccount = (req, res, next) => {
  models.User.remove({_id: req.user.id}, err => {
    if (err) {
      return next(err)
    }
    req.logout()
    req.flash('info', {msg: 'Your account has been deleted.'})
    res.redirect('/')
  })
}

export const getOauthUnlink = (req, res, next) => {
  const provider = req.params.provider
  models.User.findById(req.user.id, (err, user) => {
    if (err) {
      return next(err)
    }
    user[provider] = undefined
    user.tokens = user.tokens.filter(token => token.kind !== provider)
    user.save(err => {
      if (err) {
        return next(err)
      }
      req.flash('info', {msg: `${provider} account has been unlinked.`})
      res.redirect('/account')
    })
  })
}

export const getReset = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  models.User
    .findOne({passwordResetToken: req.params.token})
    .where('passwordResetExpires').gt(Date.now())
    .exec((err, user) => {
      if (err) {
        return next(err)
      }
      if (!user) {
        req.flash('errors', {msg: `Password reset token is invalid or
         has expired.`})
        return res.redirect('/forgot')
      }
      res.render('account/reset', {
        title: 'Password Reset'
      })
    })
}

export const postReset = (req, res, next) => {
  req.assert('password', 'Password must be at least 4 characters long.')
    .len({min: 4})
  req.assert('confirm', 'Passwords must match.').equals(req.body.password)

  const errors = req.validationErrors()

  if (errors) {
    req.flash('errors', errors)
    return res.redirect('back')
  }

  async.waterfall([
    done => {
      models.User
        .findOne({passwordResetToken: req.params.token})
        .where('passwordResetExpires').gt(Date.now())
        .exec((err, user) => {
          if (err) {
            return next(err)
          }
          if (!user) {
            req.flash('errors', {msg: `Password reset token is invalid or
             has expired.`})
            return res.redirect('back')
          }
          user.password = req.body.password
          user.passwordResetToken = undefined
          user.passwordResetExpires = undefined
          user.save(err => {
            if (err) {
              return next(err)
            }
            req.logIn(user, err => {
              done(err, user)
            })
          })
        })
    },
    (user, done) => {
      const transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASSWORD
        }
      })
      const mailOptions = {
        to: user.email,
        from: 'express-ts@starter.com',
        subject: 'Your password has been changed',
        text: `Hello,\n\nThis is a confirmation that the password
         for your account ${user.email} has just been changed.\n`
      }
      transporter.sendMail(mailOptions, err => {
        req.flash('success', {msg: `Success! Your password has been
         changed.`})
        done(err)
      })
    }
  ], err => {
    if (err) {
      return next(err)
    }
    res.redirect('/')
  })
}

export const getForgot = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  res.render('account/forgot', {
    title: 'Forgot Password'
  })
}

export const postForgot = (req, res, next) => {
  req.assert('email', 'Please enter a valid email address.').isEmail()
  req.sanitize('email').normalizeEmail({gmail_remove_dots: false})

  const errors = req.validationErrors()

  if (errors) {
    req.flash('errors', errors)
    return res.redirect('/forgot')
  }

  async.waterfall([
    done => {
      crypto.randomBytes(16, (err, buf) => {
        const token = buf.toString('hex')
        done(err, token)
      })
    },
    (token, done) => {
      models.User.findOne({email: req.body.email}, (err, user) => {
        if (err) {
          return done(err)
        }
        if (!user) {
          req.flash('errors', {msg: `Account with that email address does
           not exist.`})
          return res.redirect('/forgot')
        }
        user.passwordResetToken = token
        user.passwordResetExpires = Date.now() + 3600000 // 1 hour
        user.save(err => {
          done(err, token, user)
        })
      })
    },
    (token, user, done) => {
      const transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASSWORD
        }
      })
      const mailOptions = {
        to: user.email,
        from: 'hackathon@starter.com',
        subject: 'Reset your password on Hackathon Starter',
        text: `You are receiving this email because you (or someone else)
          have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your
          browser to complete the process:\n\n
          http://${req.headers.host}/reset/${token}\n\n
          If you did not request this, please ignore this email and your
          password will remain unchanged.\n`
      }
      transporter.sendMail(mailOptions, err => {
        req.flash('info', {msg: `An e-mail has been sent to ${user.email}
         with further instructions.`})
        done(err)
      })
    }
  ], err => {
    if (err) {
      return next(err)
    }
    res.redirect('/forgot')
  })
}
