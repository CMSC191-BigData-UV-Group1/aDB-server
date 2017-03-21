
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TYPE_DATE = exports.TYPE_TIME = exports.TYPE_INTEGER = exports.TYPE_VARCHAR = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _objectPath = require('object-path');

var _objectPath2 = _interopRequireDefault(_objectPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var log = require('debug')('database-field-definition');

var TYPE_VARCHAR = exports.TYPE_VARCHAR = 'VARCHAR';
var TYPE_INTEGER = exports.TYPE_INTEGER = 'INTEGER';
var TYPE_TIME = exports.TYPE_TIME = 'TIME';
var TYPE_DATE = exports.TYPE_DATE = 'DATE';

var FieldDefinition = function () {
  function FieldDefinition(path, options) {
    _classCallCheck(this, FieldDefinition);

    if (!path) throw new Error('Path required');
    if (!options) throw new Error('Options required');

    this._options = {
      path: path,
      type: options.type,
      validators: _lodash2.default.compact(_lodash2.default.isArray(options.validate) ? options.validate : [options.validate]),
      setters: _lodash2.default.compact([options.set])
    };
  }

  _createClass(FieldDefinition, [{
    key: 'inspect',
    value: function inspect() {
      log('-------------------- PATH --------------------');
      log('Name,      ', this.path);
      log('Type,  ', this.type);
      log('Setters ', this.setters);
      log('Validators ', this.validators);
    }

    /**
     * Run setters on value
     * @param {*} value
     */

  }, {
    key: 'transform',
    value: function transform(value) {
      return _lodash2.default.reverse(this.setters).reduce(function (res, fn) {
        return fn(res);
      }, value);
    }

    /**
     * Run validators agains value
     * @param {*} value
     */

  }, {
    key: 'validate',
    value: function validate(value) {
      // Tripped Validator
      var validator = _lodash2.default.reverse(this.validators).find(function (val) {
        return !val.fn(value);
      });

      return validator && (validator.message || 'Validation Error').replace('{VALUE}', value);
    }
  }, {
    key: 'setters',
    get: function get() {
      return _objectPath2.default.get(this, '_options.setters');
    }
  }, {
    key: 'validators',
    get: function get() {
      return _objectPath2.default.get(this, '_options.validators');
    }
  }, {
    key: 'path',
    get: function get() {
      return _objectPath2.default.get(this, '_options.path');
    }
  }, {
    key: 'type',
    get: function get() {
      return _objectPath2.default.get(this, '_options.type');
    }
  }], [{
    key: 'validatorsFor',
    value: function validatorsFor(path, options) {
      if (!options) return [];

      var validators = Array.isArray(options.validate) ? options.validate : _lodash2.default.compact([options.validate]);

      // Required validators
      if (options.required) {
        validators.push({
          validator: function validator(val) {
            return !_lodash2.default.isNil(val);
          },

          message: path + ' required'
        });
      }

      // Minimum validators
      if (options.min) {
        validators.push({
          validator: function validator(val) {
            switch (options.type.toUpperCase()) {
              case TYPE_VARCHAR:
                return val.length >= options.min;
              case TYPE_INTEGER:
                return val >= options.min;
              default:
                true;
            }
          },

          message: 'Minimin length of ' + options.min
        });
      }

      // Max validators
      if (options.max) {
        validators.push({
          validator: function validator(val) {
            switch (options.type.toUpperCase()) {
              case TYPE_VARCHAR:
                return val.length <= options.min;
              case TYPE_INTEGER:
                return val <= options.min;
              default:
                true;
            }
          },

          message: 'Maximum length of ' + options.max
        });
      }

      // Enum validators
      if (options.enum) {
        var normalizedEnum = options.enum.map(function (i) {
          return i.toLowerCase();
        });
        validators.push({
          validator: function validator(val) {
            switch (options.type.toUpperCase()) {
              case TYPE_VARCHAR:
                return normalizedEnum.indexOf(val.toLowerCase());
              default:
                true;
            }
          },

          message: 'Can only have ff values: ' + options.enum.join(', ')
        });
      }
    }
  }, {
    key: 'settersFor',
    value: function settersFor(options) {
      if (!options) return [];

      var setters = [];

      switch (options.type) {
        case TYPE_VARCHAR:
          setters.push(function (val) {
            return _lodash2.default.toString(val);
          });
          break;

        case TYPE_INTEGER:
          setters.push(function (val) {
            return _lodash2.default.toInteger(val);
          });
          break;

        default:
          throw new Error('Invalid type \'', options.type, '\'');
      }

      return setters;
    }
  }]);

  return FieldDefinition;
}();

exports.default = FieldDefinition;
//# sourceMappingURL=field-definition.js.map