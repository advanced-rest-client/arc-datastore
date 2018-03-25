'use strict';

const nconf = module.exports = require('nconf');
const path = require('path');

nconf
  .argv()
  .env([
    'GCLOUD_PROJECT',
    'MEMCACHE_URL',
    'NODE_ENV',
    'GITHUB_CLIENT_ID',
    'GITHUB_SECRET',
    'GITHUB_REDIRECT_URI',
    'SESSION_SECRET'
  ])
  .file({
    // This file is intentianally ignored in git
    file: path.join(__dirname, 'config.json')
  })
  .defaults({
    GCLOUD_PROJECT: 'advancedrestclient-1155',
    MEMCACHE_URL: 'localhost:11211',
    SESSION_SECRET: 'F4M9lekCNl'
  });
/**
 * Checks configuration for missing data.
 *
 * @param {String} setting
 */
function checkConfig(setting) {
  if (!nconf.get(setting)) {
    throw new Error(`${setting} environment variable is not set`);
  }
}
checkConfig('GITHUB_CLIENT_ID');
checkConfig('GITHUB_SECRET');
