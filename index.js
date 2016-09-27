var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var configs = []
for (var key in process.env) {
  if (key.indexOf('WEBHOOK_PATH_') == 0) {
    var match = key.match(/^WEBHOOK_PATH_(\d+)$/);
    var idx = match[1];

    var app_id = process.env['NEW_RELIC_APP_ID_' + idx];
    var key = process.env['NEW_RELIC_KEY_' + idx];
    var path = process.env['WEBHOOK_PATH_' + idx];

    if (app_id && key && path) {
      configs.push({
        app_id: app_id,
        key: key,
        webhook_path: path
      });
      console.log(`Config parsed for WEBHOOK_PATH_${idx}=${path}`);
    }
  }
}

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

for (var idx in configs) {
  var config = configs[idx];
  var path = config.webhook_path;
  var app_id = config.app_id;
  var key = config.key;

  app.post('/' + path, function (req, res, next) {
    console.log('heroku ->\n', JSON.stringify(req.body, null, 2));

    var opts = {
      url: 'https://api.newrelic.com/v2/applications/' + app_id + '/deployments.json',
      headers: {
        'X-Api-Key': key
      },
      json: {
        deployment: {
          revision: req.body.head_long,
          changelog: req.body.git_log,
          user: req.body.user
        }
      }
    }
    console.log('new relic ->\n', JSON.stringify(opts, null, 2));
    request.post(opts, function (err, res, body) {
      console.log('new relic <-\n', JSON.stringify({err: err, body: body}, null, 2));
    });

    res.status(200).send('OK');
  });
}

var port = process.env['PORT'];
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});