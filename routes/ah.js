'use strict';

const express = require('express');
const {BaseRoute} = require('./base-route');
const router = express.Router();
/**
 * A class that supports `_ah` route for health check.
 */
class AhRoute extends BaseRoute {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.initRoute();
  }
  /**
   * Initializes the routing.
   */
  initRoute() {
    router.get('/health', this._onGetHealth.bind(this));
  }
  /**
   * Writes empty response for health check.
   *
   * @param {Object} req
   * @param {Object} res
   */
  _onGetHealth(req, res) {
    res.set('Content-Type', 'plain/text');
    res.status(200).send('OK');
  }
}

new AhRoute();

module.exports = router;
