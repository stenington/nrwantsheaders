var server = require('./server')(process.env);

var port = process.env['PORT'] || 8000;
server.listen(port, function () {
  console.log(`Listening on port ${port}`);
});