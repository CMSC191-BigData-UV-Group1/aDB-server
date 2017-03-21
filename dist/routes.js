'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (app) {

  // Insert routes below
  app.use('/api/manager', require('./api/manager').routes);

  // Developers docs
  app.use('/docs/server', _express2.default.static(_path2.default.join(__dirname, '../docs/source')));
  app.use('/docs/api', _express2.default.static(_path2.default.join(__dirname, '../docs/api')));

  // Alternate Fallback
  app.route('*').get(function (req, res) {
    return res.sendFile(_path2.default.join(__dirname, 'public', 'index.html'));
  });
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _chalk = require('chalk');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=routes.js.map