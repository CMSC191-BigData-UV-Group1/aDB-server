'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _manager = require('./manager');

var _manager2 = _interopRequireDefault(_manager);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var log = require('debug')('manager.routes');

var router = _express2.default.Router();
var dbmanager = new _manager2.default();

/**
 * @api {post} /api/manager/run Run an sql query
 * @apName PostRun
 * @apiGroup Manager
 *
 * @apiParam (Account) {string}           sql - sql query
 * @apiParamExample {json} Request-Example:
 *     {
 *        "sql": "SELECT * from COURSE"
 *     }
 *
 * @apiError SyntaxError syntax error
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 301 Syntax Error
 *     {
 *       "error": "Syntax Error near 'SELECT'"
 *     }
 */
router.post('/run', function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res) {
    var result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return dbmanager.run(req.body.sql);

          case 3:
            result = _context.sent;


            // log result
            log('result ', result);

            // send result
            res.status(200).json({ result: result });

            _context.next = 12;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context['catch'](0);

            // log error
            log('run err ', _context.t0);

            // send error
            res.status(200).json({ error: _context.t0.message });

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 8]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

exports.default = router;
//# sourceMappingURL=manager.routes.js.map