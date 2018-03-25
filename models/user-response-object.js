'use strict';
const Datastore = require('@google-cloud/datastore');
const datastore = Datastore();
/**
 * A class representing result for daily data query.
 *
 * This class should be extended by class that returns specific results.
 */
class UserResponseObject {
  /**
   * @constructor
   *
   * @param {Object} user
   */
  constructor(user) {
    this.kind = 'Arc#User';
    this._populate(user);
  }
  /**
   * Populates info from the datstore object.
   *
   * @param {Object} user
   */
  _populate(user) {
    this.name = user.name;
    this.website = user.providerProfileUrl;
    this.ref = user[datastore.KEY].name;
    this.modulesCount = user.modulesCount;
    this.themesCount = user.themesCount;
    this.github = user.providerProfileUrl;
    this.modules = [];
    this.themes = [];
  }
}

module.exports.UserResponseObject = UserResponseObject;
