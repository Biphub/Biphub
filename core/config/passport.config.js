import passport from 'passport'
// Import * as passportLocal from 'passport-local'
// import * as passportFacebook from 'passport-facebook'
import _ from 'lodash'
// Const LocalStrategy = passportLocal.Strategy
// const FacebookStrategy = passportFacebook.Strategy

export const setupPassport = () => {
  passport.serializeUser((user, done) => {
    done(undefined, user.id)
  })

  /*
  Passport.deserializeUser((id: number, done) => {
    models.User.findById(id, (err: Error, user: UserInstance) => {
      done(err, user)
    })
  })
  */
  /*
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    models.User.findOne({ email: email.toLowerCase() }, (err, user: UserInstance) => {
      if (err) { return done(err) }
      if (!user) {
        return done(undefined, false, { message: `Email ${email} not found.` })
      }
      user.comparePassword(password, (err: Error, isMatch: boolean) => {
        if (err) { return done(err) }
        if (isMatch) {
          return done(undefined, user)
        }
        return done(undefined, false, { message: 'Invalid email or password.' })
      })
    })
  }))
  */
  /**
   * OAuth Strategy Overview
   *
   * - User is already logged in.
   *   - Check if there is an existing account with a provider id.
   *     - If there is, return an error message. (Account merging not supported)
   *     - Else link new OAuth account with currently logged-in user.
   * - User is not logged in.
   *   - Check if it's a returning user.
   *     - If returning user, sign in and we are done.
   *     - Else check if there is an existing account with user's email.
   *       - If there is, return an error message.
   *       - Else create a new account.
   */

  /**
   * Sign in with Facebook.
   */
  /*
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['name', 'email', 'link', 'locale', 'timezone'],
    passReqToCallback: true
  }, (req: any, accessToken, refreshToken, profile, done) => {
    if (req.user) {
      models.User.findOne({ facebook: profile.id }, (err, existingUser) => {
        if (err) { return done(err) }
        if (existingUser) {
          req.flash('errors', { msg: 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.' })
          done(err)
        } else {
          models.User.findById(req.user.id, (err, user: any) => {
            if (err) { return done(err) }
            user.facebook = profile.id
            user.tokens.push({ kind: 'facebook', accessToken })
            user.profile.name = user.profile.name || `${profile.name.givenName} ${profile.name.familyName}`
            user.profile.gender = user.profile.gender || profile._json.gender
            user.profile.picture = user.profile.picture || `https://graph.facebook.com/${profile.id}/picture?type=large`
            user.save((err: Error) => {
              req.flash('info', { msg: 'Facebook account has been linked.' })
              done(err, user)
            })
          })
        }
      })
    } else {
      models.User.findOne({ facebook: profile.id }, (err, existingUser) => {
        if (err) { return done(err) }
        if (existingUser) {
          return done(undefined, existingUser)
        }
        models.User.findOne({ email: profile._json.email }, (err, existingEmailUser) => {
          if (err) { return done(err) }
          if (existingEmailUser) {
            req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.' })
            done(err)
          } else {
            const user: any = new User()
            user.email = profile._json.email
            user.facebook = profile.id
            user.tokens.push({ kind: 'facebook', accessToken })
            user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`
            user.profile.gender = profile._json.gender
            user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`
            user.profile.location = (profile._json.location) ? profile._json.location.name : ''
            user.save((err: Error) => {
              done(err, user)
            })
          }
        })
      })
    }
  }))
  */
}

/**
 * Login Required middleware.
 */
export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

/**
 * Authorization Required middleware.
 */
export const isAuthorized = (req, res, next) => {
  const provider = req.path.split('/').slice(-1)[0]

  // TODO: Replace below with lodash
  if (_.find(req.user.tokens, {kind: provider})) {
    next()
  } else {
    res.redirect(`/auth/${provider}`)
  }
}