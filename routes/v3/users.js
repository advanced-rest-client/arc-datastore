const express = require('express');
const {BaseRoute} = require('../base-route');
const {UserStore} = require('../../lib/users-store');
const {UserResponseObject} = require('../../models/user-response-object');
const logging = require('../../lib/logging');
const router = express.Router();

const E_DATASTORE = 'datastore_request_failed';
const E_NOT_FOUND = 'not_found';
const E_EULA = 'eula_error';
/**
 * Users route in the application
 */
class UserRoute extends BaseRoute {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.initRoute();
    this.store = new UserStore();
  }
  /**
   * Initializes the route
   */
  initRoute() {
    router.options('/(.*)', this._onGetOptions.bind(this));
    router.get('/:userId', this._onGetUser.bind(this));
  }
  /**
   * Called for `OPTIONS` request to append CORS headers.
   *
   * @param {Object} req
   * @param {Object} res
   */
  _onGetUser(req, res) {
    this.store.findUser(req.params.userId)
    .then((user) => this._responseUser(res, user))
    .catch((cause) => {
      logging.error(cause);
      this.sendError(res, 500, 'Datastore error. Try again later.',
        E_DATASTORE);
    });
  }
  /**
   * Generates the response fro user request
   *
   * @param {Object} response
   * @param {?Object} user User object retreived from the datastore.
   */
  _responseUser(response, user) {
    if (!user) {
      this.sendError(response, 404, 'User does not exists.', E_NOT_FOUND);
      return;
    }
    if (!user.eula) {
      this.sendError(response, 419, 'User does not signed terms of service.',
        E_EULA);
      return;
    }
    const data = new UserResponseObject(user);
    this.sendObject(response, data);
  }
}
new UserRoute();

module.exports = router;
