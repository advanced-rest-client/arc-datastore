const fs = require('fs-extra');
const path = require('path');
/**
 * Own template engine
 */
class ViewEngine {
  /**
   * @constructor
   *
   * @param {String} file
   */
  constructor(file) {
    this.file = file;
  }
  /**
   * Renders the view.
   *
   * @param {?Object} data Data to include in the view
   * @param {Function} next
   */
  render(data, next) {
    let layout;
    fs.readFile(path.join(__dirname, 'layout.html'), 'utf8')
    .then((data) => {
      layout = data;
      return fs.readFile(this.file, 'utf8');
    })
    .then((content) => {
      if (data) {
        data = JSON.stringify(data);
      }
      layout = layout.replace('#VIEWDATA#', data);
      layout = layout.replace('#BINDVALUE#', content);
      next(null, layout);
    })
    .catch((cause) => next(cause));
  }
}
module.exports = function(filePath, options, callback) {
  const engine = new ViewEngine(filePath);
  engine.render(options, callback);
};
