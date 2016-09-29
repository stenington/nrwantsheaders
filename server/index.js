var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var winston = require('winston');
var request = require('request');

module.exports = function(env) {

  var configs = []
  for (var key in env) {
    if (key.indexOf('WEBHOOK_PATH_') == 0) {
      var match = key.match(/^WEBHOOK_PATH_(\d+)$/);
      var idx = match[1];

      var app_id = env['NEW_RELIC_APP_ID_' + idx];
      var key = env['NEW_RELIC_KEY_' + idx];
      var path = env['WEBHOOK_PATH_' + idx];

      if (app_id && key && path) {
        configs.push({
          app_id: app_id,
          key: key,
          webhook_path: path
        });
        winston.info(`Config parsed for WEBHOOK_PATH_${idx}=${path}`);
      }
    }
  }

  var app = express();
  app.use(bodyParser.urlencoded({ extended: true }));
  if ('development' == app.get('env')) {
    app.use(morgan('dev'));
  }

  configs.forEach(function (config) {
    app.post('/' + config.webhook_path, function (req, res, next) {
      winston.info('heroku ->', req.body);

      var opts = {
        url: 'https://api.newrelic.com/v2/applications/' + config.app_id + '/deployments.json',
        headers: {
          'X-Api-Key': config.key
        },
        json: {
          deployment: {
            revision: req.body.head_long,
            changelog: req.body.git_log,
            user: req.body.user
          }
        }
      }
      winston.info('new relic ->', opts);
      request.post(opts, function (err, res, body) {
        winston.info('new relic <-', {err: err, body: body});
      });

      res.status(200).send('OK');
    });
  });

  return app;
};