'use strict';

// Activate Google Cloud Trace and Debug when in production
if (process.env.NODE_ENV === 'production') {
  require('@google-cloud/trace-agent').start();
  require('@google-cloud/debug-agent').start({
    allowExpressions: true,
    capture: {
      maxFrames: 20,
      maxProperties: 100
    }
  });
}

const errors = require('@google-cloud/error-reporting')();
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bb = require('express-busboy');
const logging = require('./lib/logging');
const config = require('./config');
const session = require('express-session');
const passport = require('passport');
const MemcachedStore = require('connect-memcached')(session);
const {ApplicationRouting} = require('./routes');
const app = express();
app.enable('trust proxy');
app.disable('etag');

// Configure the session and session storage.
const sessionConfig = {
  resave: false,
  saveUninitialized: false,
  secret: config.get('SESSION_SECRET'),
  signed: true
};

const memCacheUrl = process.env.USE_GAE_MEMCACHE ?
  `${process.env.GAE_MEMCACHE_HOST}:${process.env.GAE_MEMCACHE_PORT}` :
  config.get('MEMCACHE_URL');
const store = new MemcachedStore({
  hosts: [memCacheUrl]
});
sessionConfig.store = store;
passport.serializeUser((user, cb) => {
  const id = 'user-' + user.provider + '-' + user.providerId;
  store.client.set(id, user,
    3600, (err) => {
    cb(err, id);
  });
});
passport.deserializeUser((id, cb) => {
  store.client.get(id, (err, data) => {
    if (data) {
      store.client.set(id, data,
        3600, (err) => {
        cb(err, data);
      });
    } else {
      cb(err, data);
    }
  });
});
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

app.set('x-powered-by', false);
app.engine('html', require('./views/engine'));
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
bb.extend(app); // For multipart queries.
app.use(express.static(path.join(__dirname, 'public')));

const routing = new ApplicationRouting();
routing.start(app);

process.on('uncaughtException', (err) => {
  logging.error(err);
});
process.on('unhandledRejection', (reason) => {
  logging.error(reason);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  console.log(req.url);
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  errors.report(err);
  logging.error(err);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
