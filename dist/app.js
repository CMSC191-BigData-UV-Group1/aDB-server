'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = require('debug')('app');

// Create server
var app = (0, _express2.default)();
var server = _http2.default.createServer(app);

// Use CORS
app.use((0, _cors2.default)());

// Bodyparser
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());

// Load Routes
require('./routes').default(app);

// Start Server
server.listen(process.env.PORT, function () {
  return log('Server listening on port ' + _chalk2.default['green'](process.env.PORT));
});
//# sourceMappingURL=app.js.map