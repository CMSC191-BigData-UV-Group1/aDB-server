'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _parser = require('../parser');

var _parser2 = _interopRequireDefault(_parser);

var _modelDb = require('../default-models/model-db');

var _modelDb2 = _interopRequireDefault(_modelDb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var log = require('debug')('manager');

var Manager = function () {
  function Manager(props) {
    _classCallCheck(this, Manager);
  }
  // load databases from file and cache here


  /**
   * Run an sql command
   * @returns {Promise<object>}
   * @throws {*}
   */


  _createClass(Manager, [{
    key: 'run',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(sql) {
        var parsed, Table, mappedInsert;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:

                log('======== RUNNING ========');
                log('DB   ', 'default');
                log('Sql  ', sql);

                // generate query tree
                parsed = _parser2.default.parse(sql);
                // const parsed = {
                //   type: 'insert',
                //   table: 'COURSE',
                //   formalValues: [
                //     'CNo',
                //     'CTitle',
                //     'CDesc',
                //     'NoOfUnits',
                //     'HasLab',
                //     'SemOffered'
                //   ],
                //   actualValues: [
                //     'CMSC 191',
                //     'Special Topics',
                //     'Big Data Management and Trends',
                //     '3.0',
                //     '1',
                //     '1st'
                //   ]
                // }

                // const parsed = {
                //   type: 'select',
                //   data: {
                //     CNo: 'COURSE',
                //     CTitle: 'COURSE',
                //     AcadYear: 'COURSEOFFERING'
                //   },
                //   columnAlias: {
                //     CNo: 'a',
                //     CTitle: 'a',
                //     AcadYear: 'b'
                //   },
                //   tableAlias: {
                //     a: 'COURSE',
                //     b: 'COURSEOFFERING'
                //   },
                //   conditions: {
                //     COURSE: {
                //       CNo: 'CMSC 191'
                //     }
                //   }
                // }

                log('parsed   ', parsed);

                _context.t0 = parsed.type;
                _context.next = _context.t0 === 'insert' ? 8 : _context.t0 === 'select' ? 13 : 14;
                break;

              case 8:
                Table = _modelDb2.default.table(parsed.table);

                if (Table) {
                  _context.next = 11;
                  break;
                }

                throw new Error('Invalid table \'' + parsed.table + '\'');

              case 11:
                mappedInsert = Table.mapParsed(parsed);
                return _context.abrupt('return', Table.insert(mappedInsert));

              case 13:
                return _context.abrupt('return', _modelDb2.default.select(parsed));

              case 14:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function run(_x) {
        return _ref.apply(this, arguments);
      }

      return run;
    }()
  }]);

  return Manager;
}();

exports.default = Manager;
//# sourceMappingURL=manager.js.map