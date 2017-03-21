'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _COURSE = require('./../../tables/COURSE');

var _COURSE2 = _interopRequireDefault(_COURSE);

var _COURSEOFFERING = require('./../../tables/COURSEOFFERING');

var _COURSEOFFERING2 = _interopRequireDefault(_COURSEOFFERING);

var _STUDCOURSE = require('./../../tables/STUDCOURSE');

var _STUDCOURSE2 = _interopRequireDefault(_STUDCOURSE);

var _STUDENT = require('./../../tables/STUDENT');

var _STUDENT2 = _interopRequireDefault(_STUDENT);

var _STUDENTHISTORY = require('./../../tables/STUDENTHISTORY');

var _STUDENTHISTORY2 = _interopRequireDefault(_STUDENTHISTORY);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var log = require('debug')('parser');

// Tables

// Enums
// import SemOffered     from './../../enums/SemOffered';
// import Semester       from './../../enums/Semester';


var Parser = function () {
  function Parser() {
    _classCallCheck(this, Parser);
  }

  _createClass(Parser, null, [{
    key: 'processSELECT',


    /**
     * Parse the SELECT statement and check for syntax errors
     * @param {String} sql - sql command to parse
     * @returns {Object} res - Object that contains the important results of the parser
     * @throws {*}
     */
    value: function processSELECT(sql, db) {
      /**
       * res object will contain these keys:
       *
       * data - Object that contains key-value pairs of column-table
       * conditions - the conditions in the WHERE statement (if there is)
       */
      var res = {
        command: 'select',
        data: {},
        conditions: {}
      };

      // Removed processed regex
      sql = sql.replace(Parser.regex.SELECT_STATEMENT, '');

      // Check for syntax error
      if (!sql.match(Parser.regex.SELECT.COLUMNS)) {
        throw new Error('Syntax error near \'' + sql + '\'');
      }

      // Parse the columns
      var requestedColumns = sql.match(Parser.regex.SELECT.COLUMNS)[0].split(',');
      requestedColumns = requestedColumns.map(function (e) {
        return e.trim();
      });

      // Removed processed regex
      sql = sql.replace(Parser.regex.SELECT.COLUMNS, '');

      // Check for syntax error
      if (!sql.match(Parser.regex.SELECT.FROM)) {
        throw new Error('Syntax error near \'' + sql + '\'');
      }

      // Removed processed regex
      sql = sql.replace(Parser.regex.SELECT.FROM, '');

      // Check for syntax error
      if (!sql.match(Parser.regex.SELECT.TABLES)) {
        throw new Error('Syntax error near \'' + sql + '\'');
      }

      // Parse the tables
      var requestedTables = sql.match(Parser.regex.SELECT.TABLES)[0].split(',');
      requestedTables = requestedTables.map(function (e) {
        return e.trim();
      });

      // If "*" is selected, add all the columns of all the tables to res.data
      if (requestedColumns[0] === '*') {
        requestedTables.forEach(function (table) {
          Parser.tables[table]['columns'].forEach(function (col) {
            res.data[col.name] = table;
          });
        });
      } else {
        var _loop = function _loop(i) {
          var col = requestedColumns[i];

          var count = 0;
          requestedTables.forEach(function (table) {
            Parser.tables[table]['columns'].forEach(function (e) {
              if (e['name'] == col) res.data[col] = table;
            });
            count += Parser.tables[table]['columns'].filter(function (e) {
              return e['name'] === col;
            }).length;
          });

          // Checks for ambiguous columns (if no aliasing)
          if (count > 1) {
            throw new Error('Column \'' + col + '\' in field list is ambiguous');
          }
        };

        for (var i = 0; i < requestedColumns.length; i++) {
          _loop(i);
        }
      }

      // Removed processed regex
      sql = sql.replace(Parser.regex.SELECT.TABLES, '');

      // Check for syntax error
      if (!sql.match(Parser.regex.SELECT.WHERE)) {
        log(sql);
        throw new Error('Syntax error near \'' + sql + '\'');
      }

      // Parse conditions
      var conditions = sql.match(Parser.regex.SELECT.WHERE)[0];

      // Check for syntax error
      if (!sql.match(Parser.regex.SELECT.WHERE)) {
        throw new Error('Syntax error near \'' + sql + '\'');
      }

      var cond = sql.replace(/^WHERE\s+/, '');
      var column = cond.split('=')[0].trim();
      res.conditions[requestedTables[0]] = {};
      var temp = cond.split('=')[1].trim();
      res.conditions[requestedTables[0]][column] = temp.substring(0, temp.length - 1);

      return res;
    }

    /**
     * Parse the INSERT statement and check for syntax errors
     * @param {String} sql - sql command to parse
     * @returns {Object} res - Object that contains the important results of the parser
     * @throws {*}
     */

  }, {
    key: 'processINSERT',
    value: function processINSERT(sql, db) {
      /**
       * res object will contain these keys:
       *
       * table - the table where the row will be inserted
       * formalValues - the columns of the table that the data will be inserted
       * actualValues - the actual values that corresponds to each columns in the formalValues
       */
      var res = {
        command: 'insert'
      };

      // Remove processed regex
      sql = sql.replace(Parser.regex.INSERT_STATEMENT, '');

      // Check for syntax error
      if (!sql.match(Parser.regex.INSERT.TABLE)) {
        throw new Error('Syntax error near \'' + sql + '\'');
      }

      // Parse the table
      res['table'] = sql.match(Parser.regex.INSERT.TABLE)[0].trim();

      // Remove processed regex
      sql = sql.replace(Parser.regex.INSERT.TABLE, '');

      // Parse the formal values
      res['formalValues'] = sql.match(Parser.regex.INSERT.FORMAL_VALUES)[0].trim().replace(/\(|\)/g, '');
      res['formalValues'] = res['formalValues'].split(',').map(function (e) {
        return e.trim();
      });

      // Remove processed regex
      sql = sql.replace(Parser.regex.INSERT.FORMAL_VALUES, '');

      // Check for syntax error
      if (!sql.match(Parser.regex.INSERT.VALUES)) {
        throw new Error('Syntax error near \'' + sql + '\'');
      }

      // Remove processed regex
      sql = sql.replace(Parser.regex.INSERT.VALUES, '');

      // Check for syntax error
      if (!sql.match(Parser.regex.INSERT.ACTUAL_VALUES)) {
        throw new Error('Syntax error near \'' + sql + '\'');
      }

      // Parse the actual values
      res['actualValues'] = sql.match(Parser.regex.INSERT.ACTUAL_VALUES)[0].trim().replace(/\(|\)|;/g, '');
      res['actualValues'] = res['actualValues'].split(',').map(function (e) {
        return e.trim();
      });

      // Remove processed regex
      sql = sql.replace(Parser.regex.INSERT.ACTUAL_VALUES, '');

      if (res['formalValues'].length !== res['actualValues'].length) {
        throw new Error('Length of formal values and actual values are not the same. Expected ' + res['formalValues'].length + ', got ' + res['actualValues'].length + '.');
      }

      return res;
    }

    /**
     * Check grammar, and other checkables, build a query tree
     * @param {String} sql - sql command to parse
     * @returns {*}
     * @throws {*}
     */

  }, {
    key: 'parse',
    value: function parse(sql, db) {
      // Check if matched with SELECT statement
      if (sql.match(Parser.regex.SELECT_STATEMENT)) {
        return Parser.processSELECT(sql, db);
      }

      // Check if matched with INSERT statement
      if (sql.match(Parser.regex.INSERT_STATEMENT)) {
        return Parser.processINSERT(sql, db);
      }

      throw new Error('Syntax Error. Please use either SELECT or INSERT statements only.');
    }
  }, {
    key: 'regex',
    get: function get() {
      return {
        SELECT_STATEMENT: /^\s*SELECT\s+/i,
        INSERT_STATEMENT: /^\s*INSERT\s+INTO\s+/i,
        SELECT: {
          COLUMNS: /(\*\s+)|((\w+\s*)(,\s*\w+\s*)*)/,
          FROM: /^FROM\s+/i,
          TABLES: /(\w+\s*)(,\s*\w+\s*)*/,
          WHERE: /^WHERE\s+\w+\s*=\s*((\w+)|(\'.*\'))\s*;/i
        },
        INSERT: {
          TABLE: /\w+\s+/,
          FORMAL_VALUES: /\(\s*(\w+\s*)(,\s*\w+)*\s*\)\s+/,
          VALUES: /^VALUES\s+/i,
          ACTUAL_VALUES: /\(\s*((\'.*\')|(?!,.+))\s*(,\s*(\'.*\')|(?!,.+))*\s*\)\s*;$/
        }
      };
    }
  }, {
    key: 'tables',
    get: function get() {
      return {
        'COURSE': _COURSE2.default,
        'COURSEOFFERING': _COURSEOFFERING2.default,
        'STUDCOURSE': _STUDCOURSE2.default,
        'STUDENT': _STUDENT2.default,
        'STUDENTHISTORY': _STUDENTHISTORY2.default
      };
    }
  }, {
    key: 'columns',
    get: function get() {
      var columns = [];

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(Parser.tables)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var table = _step.value;
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = Parser.tables[table]['columns'][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var column = _step2.value;

              columns.push(column['name']);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return columns;
    }
  }]);

  return Parser;
}();

exports.default = Parser;
//# sourceMappingURL=parser.js.map