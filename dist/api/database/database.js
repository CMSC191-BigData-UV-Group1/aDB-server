
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

var _requireGlob = require('require-glob');

var _requireGlob2 = _interopRequireDefault(_requireGlob);

var _database = require('./database.constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var log = require('debug')('database');

'';

var DatabaseType = function () {
  function DatabaseType(options) {
    _classCallCheck(this, DatabaseType);

    if (!options) throw new Error('Options required');
    if (!options.name) throw new Error('Name required');
    if (!options.location) throw new Error('Location required');

    this._options = {
      name: options.name,
      location: options.location,
      tables: {}
    };

    // Add tables
    // if (options.tables && Array.isArray(options.tables))
    //   options.tables.map(t => this.table(t.name, t));
  }

  _createClass(DatabaseType, [{
    key: 'table',


    /**
     * Get / Create a table model
     *
     * @param {String} name
     * @param {Schema} [schema]
     */
    value: function table(name, schema) {
      if (!name) throw new Error('Table name required');

      var normalizedName = name.toLowerCase();

      // Getter
      if (!schema) {
        // log(`============ GET TABLE ============`)
        // log(`Name   `, name)
        return _objectPath2.default.get(this, '_options.tables.' + normalizedName);
      }

      // log(`============ SET TABLE ============`)
      // log(`Name     `, name)
      // log(`Schema   `, schema)

      // Setter
      if (this.tables[normalizedName]) throw new Error('Table ' + name + ' already exists in DB \'' + this.name + '\'');

      var TableSchema = require('../database-table').default;

      // Check schema
      if (!(schema instanceof TableSchema)) throw new Error('Invalid schema \'', schema, '\'');

      // Attach db
      schema.attach(this);

      // Add to map of tables
      _objectPath2.default.set(this, '_options.tables.' + normalizedName, schema);

      // return table instance
      return this.tables[normalizedName];
    }
  }, {
    key: 'inspect',
    value: function inspect() {
      var _this = this;

      log('================================== DB ==================================');
      log('Name,      ', this.name);
      log('Location,  ', this.location);
      // log(`Options   `, this._options)
      log('------------------------ TABLES ------------------------');
      _lodash2.default.keys(this.tables).map(function (tb) {
        return _this.tables[tb].inspect();
      });
    }

    /**
     * Create a database connection
     *
     * @param {*} options
     */

  }, {
    key: 'select',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(parsed) {
        var _this2 = this;

        var TableSchema, tables, err, found, all, sameKeys, grouped, merged, filter, conformFieldFunction, comparisonFunction, filtered;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:

                log('=========== SELECT =========');
                log('DB    ', this.name);
                log('Parsed ', parsed);

                TableSchema = require('../database-table').default;

                // Load Tables

                tables = _lodash2.default.values(parsed.tableAlias).reduce(function (r, tableName) {
                  return _extends({}, r, _defineProperty({}, tableName, _this2.table(tableName)));
                }, {});

                // log(`tables `, tables);

                err = _lodash2.default.keys(tables).find(function (t) {
                  return !(tables[t] instanceof TableSchema);
                });

                if (!err) {
                  _context2.next = 8;
                  break;
                }

                throw new Error('Invalid Table ', err);

              case 8:
                found = {};

                // Find all in every table

                _context2.next = 11;
                return Promise.all(_lodash2.default.keys(tables).map(function () {
                  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(tableName) {
                    var upperCasedKey, filter, projection;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            upperCasedKey = tableName.toUpperCase();
                            filter = {}; //parsed.conditions[upperCasedKey] || {}

                            projection = _lodash2.default.keys(parsed.data);
                            _context.next = 5;
                            return tables[tableName].find(filter, projection);

                          case 5:
                            found[tableName] = _context.sent;

                          case 6:
                          case 'end':
                            return _context.stop();
                        }
                      }
                    }, _callee, _this2);
                  }));

                  return function (_x2) {
                    return _ref2.apply(this, arguments);
                  };
                }()));

              case 11:

                log(found);

                // Merge
                all = _lodash2.default.values(found).reduce(function (r, v) {
                  return r.concat(v);
                }, []);

                log('all ', all);

                sameKeys = _lodash2.default.values(tables).map(function (t) {
                  return _lodash2.default.keys(t.columns);
                });

                sameKeys = sameKeys.slice(1).reduce(function (r, v) {
                  return _lodash2.default.intersection(r, v);
                }, sameKeys[0]);
                log('SameKeys ', sameKeys);

                grouped = _lodash2.default.groupBy(all, function (v) {
                  return sameKeys.map(function (k) {
                    return v[k];
                  }).join('-');
                });

                log('grouped', grouped);

                merged = _lodash2.default.values(grouped).map(function (pair) {
                  return pair.reduce(function (r, v) {
                    return _extends({}, r, v);
                  }, {});
                });

                log('Merged ', merged);

                // Filter
                filter = _lodash2.default.values(parsed.conditions).reduce(function (r, v) {
                  return _extends({}, r, v);
                }, {});

                log('Filter ', filter);

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
                filtered = _lodash2.default.filter(merged, comparisonFunction);


                log('Filtered ', filtered);

                return _context2.abrupt('return', filtered);

              case 29:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function select(_x) {
        return _ref.apply(this, arguments);
      }

      return select;
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
    key: 'tables',
    get: function get() {
      return _objectPath2.default.get(this, '_options.tables');
    }
  }], [{
    key: 'create',
    value: function create(options) {
      if (!options) throw new Error('Options required');
      if (!options.name) throw new Error('DB Name required');

      // normalize name
      var normalizedName = options.name.toLowerCase();

      // data path
      var dbPath = _path2.default.join(_database.PATH_DATA_ROOT, _database.DB_PREFIX + normalizedName);

      // Check exist / validity
      if (_fsExtra2.default.existsSync(dbPath)) throw new Error('DB with same name exists \'' + options.name + '\'');

      // Write db metadata
      _fsExtra2.default.outputFileSync(_path2.default.join(dbPath, 'meta.json'), JSON.stringify({
        name: options.name
      }, null, 2));

      // Create DB instance
      return new this({
        name: normalizedName,
        location: dbPath
      });
    }

    /**
     * Open a database connection
     *
     * @param {String}  name
     * @param {Object}  options
     * @param {Boolean} options.createNotExist
     */

  }, {
    key: 'open',
    value: function open(name, options) {
      if (!name) throw new Error('DB Name required');

      // normalize name
      var normalizedName = name.toLowerCase();

      // data path
      var dbPath = _path2.default.join(_database.PATH_DATA_ROOT, _database.DB_PREFIX + normalizedName);

      if (!_fsExtra2.default.existsSync(dbPath)) {
        // If !exist, create new
        if (options && options.createNotExist) return this.create({ name: name });

        throw new Error('Db not found \'' + name + '\'');
      }

      // Find tables
      // const globbedTables = globber.sync([path.join(dbPath + '/tb-*/meta.json')]);

      // log(`globbedTables `, globbedTables);

      // const TableSchema = require('../database-table').default;

      // Create TableTypes
      // const tables = _.reduce(globbedTables, (r, meta, path) => r.concat(new TableSchema(meta)), [])

      // Create DB instance
      return new this({
        name: normalizedName,
        location: dbPath
      });
    }
  }]);

  return DatabaseType;
}();

exports.default = DatabaseType;
//# sourceMappingURL=database.js.map