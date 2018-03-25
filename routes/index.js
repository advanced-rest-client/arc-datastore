/**
 * Configures routing depending on API version.
 */
class ApplicationRouting {
  /**
   * Starts the routing.
   *
   * @param {Object} app Express application
   */
  start(app) {
    this.baseRouting(app);
    this.v2routing(app);
    this.v3routing(app);
  }
  /**
   * Common routes for any version.
   *
   * @param {Object} app Express application
   */
  baseRouting(app) {
    app.use('/.well-known', require('./letsencrypt'));
    app.use('/_ah', require('./ah'));
  }
  /**
   * Initializes routing for version 2
   *
   * @param {Object} app Express application
   */
  v2routing(app) {
    app.use('/analyzer', require('./v2/analyzer'));
    app.use('/analytics', require('./v2/analytics'));
    app.use('/tasks', require('./v2/tasks'));
    app.use('/info', require('./v2/info'));
  }
  /**
   * Initializes routing for version 3
   *
   * @param {Object} app Express application
   */
  v3routing(app) {
    app.use('/v3/analyzer', require('./v2/analyzer'));
    app.use('/v3/analytics', require('./v2/analytics'));
    app.use('/v3/tasks', require('./v2/tasks'));
    app.use('/v3/info', require('./v2/info'));
    app.use('/v3/users', require('./v3/users'));
    app.use('/v3/auth', require('./v3/auth'));

    app.use('/user', require('./v3/profile'));
  }
}
module.exports.ApplicationRouting = ApplicationRouting;
