var winston = require('winston');
var server = require('./server')(process.env);

var port = process.env['PORT'] || 8000;
server.listen(port, function () {
  winston.info(`Listening on port ${port}`);
});