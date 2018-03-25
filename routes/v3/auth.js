const express = require('express');
const {BaseRoute} = require('../base-route');
const githubPassport = require('../../lib/github-passport');
// const logging = require('../../lib/logging');
const router = express.Router();

/**
 * Users route in the application
 */
class AuthRoute extends BaseRoute {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.initRoute();
  }
  /**
   * Initializes the route
   */
  initRoute() {
    router.options('/(.*)', this._onGetOptions.bind(this));
    router.get('/github', githubPassport.authenticate());
    router.get('/github/callback',
      githubPassport.authenticate({
        failureRedirect: '/user/login-interuppted'
      }),
      this._onCallback.bind(this));
  }
  /**
   * Called for `OPTIONS` request to append CORS headers.
   *
   * @param {Object} req
   * @param {Object} res
   */
  _onCallback(req, res) {
    console.log('Callback');
    res.redirect('/user/account');
  }
}
new AuthRoute();

module.exports = router;
