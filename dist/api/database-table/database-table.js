
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _objectPath = require('object-path');

var _objectPath2 = _interopRequireDefault(_objectPath);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _databaseTable = require('./database-table.constants');

var _fieldDefinition = require('./field-definition');

var _fieldDefinition2 = _interopRequireDefault(_fieldDefinition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var log = require('debug')('database-table');

var TableSchema = function () {
  function TableSchema(options) {
    var _this = this;

    _classCallCheck(this, TableSchema);

    if (!options) throw new Error('Options required');
    if (!options.name) throw new Error('Name required');
    if (!options.columns) throw new Error('Schema required');

    this._options = {
      name: options.name,
      columns: {}
    };

    // Add columns
    if (_lodash2.default.isPlainObject(options.columns)) _lodash2.default.keys(options.columns).map(function (s) {
      return _this.column(s, options.columns[s]);
    });
  }

  _createClass(TableSchema, [{
    key: 'inspect',
    value: function inspect() {
      var _this2 = this;

      log('Name,      ', this.name);
      log('Location,  ', this.location);
      log('Options   ', this._options);
      log('+++++++++++++++++ COLUMNS +++++++++++++++++');

      _lodash2.default.keys(this.columns).map(function (col) {
        return _this2.columns[col].inspect();
      });
    }

    /**
     *
     * @param {string} name
     * @param {object} [definition]
     */

  }, {
    key: 'column',
    value: function column(name, definition) {
      if (!name) throw new Error('Column name required');

      var normalizedName = name.toLowerCase();

      // Getter
      if (!definition) {
        // log(`============ GET COLUMN ============`)
        // log(`Name   `, name)
        return _objectPath2.default.get(this, '_options.columns.' + normalizedName);
      }

      // log(`============ SET COLUMN ============`)
      // log(`Name       `, name)
      // log(`Definition `, definition)

      // Setter
      if (this.columns[normalizedName]) throw new Error('Column ' + name + ' already exists in Table \'' + this.name + '\'');

      // create definition
      var fieldDef = new _fieldDefinition2.default(name, definition);

      // Add to map of tables
      _objectPath2.default.set(this, '_options.columns.' + normalizedName, fieldDef);

      // return table instance
      return this.columns[normalizedName];
    }
  }, {
    key: 'attach',
    value: function attach(database) {
      if (this._options.attached) throw new Error('Already attached');

      if (!database) throw new Error('DB instance required');

      var Database = require('../database').default;

      if (!(database instanceof Database)) throw new Error('Invalid DB instance \'', database, '\'');

      var normalizedName = this.name.toLowerCase();

      var dbPath = _path2.default.join(database.location, _databaseTable.TABLE_PREFIX + normalizedName);

      _objectPath2.default.set(this, '_options.location', dbPath);

      // log(`Attaching `, this.name, `to DB`, database.name)
      // log(`dbPath @ `, dbPath)

      // Write table metadata
      _fsExtra2.default.outputFileSync(_path2.default.join(dbPath, 'meta.json'), JSON.stringify({
        database: database.name,
        name: this.name,
        schema: this.columns
      }, null, 2));
    }
  }, {
    key: 'validate',
    value: function validate(mappings) {
      var _this3 = this;

      // Transform values
      return _lodash2.default.reduce(mappings, function (res, val, key) {
        var normalizedKey = key.toLowerCase();
        // Not a registered column
        if (!_this3.columns[normalizedKey]) return;

        // Run setters
        var trans = _this3.columns[normalizedKey].transform(val);

        // Run validators
        var error = _this3.columns[normalizedKey].validate(val);
        if (error) throw new Error(error);

        return _extends({}, res, _defineProperty({}, normalizedKey, trans));
      }, {});
    }
  }, {
    key: 'insert',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(mappings) {
        var dataSetPath, toWrite, dataSet;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:

                // Retrieve dataset to write into
                dataSetPath = _path2.default.join(this.location, 'ds-1.json');


                log('=========== INSERT =========');
                log('Table    ', this.name);
                log('Mappings ', mappings);
                log('WritePath ', dataSetPath);

                // Transform and validate
                toWrite = this.validate(mappings);


                log('ToWrite   ', toWrite);

                // Load dataset
                dataSet = _fsExtra2.default.existsSync(dataSetPath) ? _fsExtra2.default.readJsonSync(dataSetPath) : [];


                log('Start DataSet ', dataSet);

                // Add new item
                dataSet.push(toWrite);

                log('End DataSet ', dataSet);

                // Save dataset
                _fsExtra2.default.outputJsonSync(dataSetPath, dataSet);

              case 12:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function insert(_x) {
        return _ref.apply(this, arguments);
      }

      return insert;
    }()
  }, {
    key: 'find',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(filter, projection) {
        var dataSetPath, dataSet, conformFieldFunction, comparisonFunction, filtered;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:

                // Retrieve dataset to read into
                dataSetPath = _path2.default.join(this.location, 'ds-1.json');

                // clean filter

                filter = _lodash2.default.pickBy(filter, function (v) {
                  return v !== undefined;
                });

                log('=========== FIND =========');
                log('Table    ', this.name);
                log('Filter   ', filter);
                log('Projection ', dataSetPath);

                // Load dataset
                dataSet = _fsExtra2.default.existsSync(dataSetPath) ? _fsExtra2.default.readJsonSync(dataSetPath) : [];

                conformFieldFunction = function conformFieldFunction(filter, key) {
                  return _defineProperty({}, key.toLowerCase(), function (v) {
                    return _lodash2.default.eq(v, filter[key]);
                  });
                };

                comparisonFunction = _lodash2.default.conforms(_lodash2.default.keys(filter).reduce(function (r, key) {
                  return _extends({}, r, conformFieldFunction(filter, key));
                }, {}));


                log('comparisonFunction ', comparisonFunction);

                // Filter
                filtered = _lodash2.default.filter(dataSet, comparisonFunction);

                // Project

                return _context2.abrupt('return', _lodash2.default.isEmpty(projection) ? filtered : filtered.map(function (i) {
                  return _lodash2.default.pick(i, projection.map(function (k) {
                    return k.toLowerCase();
                  }));
                }));

              case 12:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function find(_x2, _x3) {
        return _ref2.apply(this, arguments);
      }

      return find;
    }()
  }, {
    key: 'name',
    get: function get() {
      return _objectPath2.default.get(this, '_options.name');
    }
  }, {
    key: 'location',
    get: function get() {
      return _objectPath2.default.get(this, '_options.location');
    }
  }, {
    key: 'columns',
    get: function get() {
      return _objectPath2.default.get(this, '_options.columns');
    }
  }], [{
    key: 'mapParsed',
    value: function mapParsed(parsed) {
      return parsed.formalValues.reduce(function (r, col, ind) {
        return _extends({}, r, _defineProperty({}, col, parsed.actualValues[ind]));
      }, {});
    }
  }]);

  return TableSchema;
}();

exports.default = TableSchema;
//# sourceMappingURL=database-table.js.map