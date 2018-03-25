'use strict';

const winston = require('winston');
const Logger = winston.Logger;
const Console = winston.transports.Console;

const {LoggingWinston} = require('@google-cloud/logging-winston');
const loggingWinston = new LoggingWinston();

const colorize = process.env.NODE_ENV !== 'production';
const logger = new Logger({
  level: 'info', // log at 'info' and above
  transports: [
    // Log to the console
    new Console({
      json: true,
      colorize: colorize
    }),
    loggingWinston,
  ]
});

module.exports = {
  error: logger.error,
  warn: logger.warn,
  info: logger.info,
  log: logger.log,
  verbose: logger.verbose,
  debug: logger.debug,
  silly: logger.silly
};
