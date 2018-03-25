'use strict';

/**
 * Error report from the server.
 */
class ErrorResponse {
  /**
   * To construct error response provide a `code`
   * and the reason `message`.
   *
   * @param {String} code Code associated with the error message.
   * @param {String} message A reason message.
   */
  constructor(code, message) {
    this.error = true;
    this.code = code || 'unknown_error';
    this.message = message || 'Unknown error ocurred';
  }
}

module.exports.ErrorResponse = ErrorResponse;
