'use strict';

const express = require('express');
const {BaseRoute} = require('../base-route');
const fetch = require('node-fetch');
const logging = require('../../lib/logging');
const router = express.Router();

/**
 * Tasks are colled from cron job.
 * They execute the analyser and wait for the response.
 *
 */
class TasksRoute extends BaseRoute {

  get cronHeader() {
    return 'X-Appengine-Cron';
  }

  get allowedTypes() {
    return ['daily', 'weekly', 'monthly'];
  }

  get allowedScopes() {
    return ['users', 'sessions'];
  }

  constructor() {
    super();
    this.initRoute();
  }

  initRoute() {
    router.get('/:type/:scope', this._onTaskCalled.bind(this));
  }

  _onTaskCalled(req, res) {
    const type = req.params.type;
    const scope = req.params.scope;

    if (this.allowedTypes.indexOf(type) === -1 || this.allowedScopes.indexOf(scope) === -1) {
      return this.sendError(res, 404, 'Unknown path');
    }

    // var cronTest = req.get(this.cronHeader);
    // if (!cronTest) {
    //   return this.sendError(res, 400, 'This endpoint can be called only by the cron jon only.');
    // }

    this._callService(type, scope, res);
  }

  _callService(type, scope, res) {
    const url = this._getServiceUrl(type, scope);
    // console.info('Calling service from cron: ', url);
    logging.info('Calling service from cron: ', url);
    fetch(url)
    .then((response) => {
      if (!response.ok) {
        return response.text()
        .then((text) => {
          logging.error('Service called with error: ', response.status);
          logging.error('Service response: ', text);
          res.status(response.status).end();
        });
      }
      logging.info('Service called with the success: ', response.status);
      res.status(response.status).end();
    })
    .catch((e) => {
      console.error(e);
      return this.sendError(res, 500, 'Service call error');
    });
  }

  _getServiceUrl(type, scope) {
    var url = 'https://advancedrestclient-1155.appspot.com/analyzer/' + type + '/' + scope;
    var d = new Date();
    d.setDate(d.getDate() - 1); // subrtact a day
    url += '?date=';
    url += d.getFullYear() + '-';
    var month = d.getMonth();
    month++;
    if (month < 10) {
      month = '0' + month;
    }
    url += month + '-';
    var day = d.getDate();
    if (day < 10) {
      day = '0' + day;
    }
    url += day;
    return url;
  }
}

new TasksRoute();

module.exports = router;
