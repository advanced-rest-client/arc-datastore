const express = require('express');
const {BaseRoute} = require('../base-route');
const ensureLoggedIn = require('connect-ensure-login');
const githubPassport = require('../../lib/github-passport');
const router = express.Router();

/**
 * Profile route in the application
 */
class ProfileRoute extends BaseRoute {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.initRoute();
    this._authError = this._authError.bind(this);
  }
  /**
   * Initializes the route
   */
  initRoute() {
    router.get('/account',
      githubPassport.required,
      this._onGetAccount.bind(this),
      this._authError
    );
    router.get('/login-interuppted',
      this._onLoginInteruppted.bind(this));
    router.get('/login',
      this._onLogin.bind(this));
  }
  /**
   * Renders account information page.
   *
   * @param {Object} req
   * @param {Object} res
   */
  _onGetAccount(req, res) {
    res.render('user-settings', {
      user: req.user
    });
  }
  /**
   * Renders account information page.
   *
   * @param {Object} req
   * @param {Object} res
   */
  _onLoginInteruppted(req, res) {
    res.render('login-interuppted');
  }
  /**
   * Renders login page.
   *
   * @param {Object} req
   * @param {Object} res
   */
  _onLogin(req, res) {
    res.render('login');
  }
  /**
   *
   *
   * @param {Object} req
   * @param {Object} res
   */
  _authError(err, req, res, next) {
    console.error(err);
    res.redirect('/user/login');
    next();
  }
}
new ProfileRoute();

module.exports = router;
