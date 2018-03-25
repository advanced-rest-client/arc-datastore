const config = require('../config');
const passport = require('passport');
const Strategy = require('passport-github');
const {UserStore} = require('../lib/users-store');

passport.use(new Strategy({
    clientID: config.get('GITHUB_CLIENT_ID'),
    clientSecret: config.get('GITHUB_SECRET'),
    callbackURL: config.get('GITHUB_REDIRECT_URI'),
    scope: ['user', 'public_repo']
  },
  (accessToken, refreshToken, profile, cb) => {
    const store = new UserStore();
    store.findOrCreate(profile, 'github')
    .then((user) => cb(null, user))
    .catch((cause) => cb(cause));
  }
));

/**
 * Middleware that requires the user to be logged in. If the user is not logged
 * in, it will redirect the user to authorize the application and then return
 * them to the original URL they requested.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
function authRequired(req, res, next) {
  console.log('authRequired', req.user);
  if (!req.user || Object.keys(req.user).length === 0) {
    console.log('Redirecting user to github login page.');
    req.session.oauth2return = req.originalUrl;
    res.redirect('/user/login');
    return;
  }
  next();
}
/**
 * Returns 401 status code if the user is not authorized
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
function authRequired401(req, res, next) {
  if (!req.user) {
    const body = JSON.stringify({
      code: 'unauthorized',
      message: 'Authorization required.'
    }, null, 2);
    res.set('Content-Type', 'application/json');
    res.status(401).send(body);
    return;
  }
  next();
}
/**
 * Middleware to authenticate the user.
 * @param {?Object} opts
 * @return {Function}
 */
function authenticate(opts) {
  return passport.authenticate('github', opts);
}

module.exports = {
  required: authRequired,
  required401: authRequired401,
  authenticate: authenticate,
  passport: passport
};
