
'use strict';

const log = require('debug')('database-field-definition');

import _ from 'lodash';
import $ from 'object-path';

export const TYPE_VARCHAR = 'VARCHAR';
export const TYPE_INTEGER = 'INTEGER';
export const TYPE_TIME = 'TIME';
export const TYPE_DATE = 'DATE';

export default class FieldDefinition {
  constructor(path, options) {
    if (!path) throw new Error(`Path required`);
    if (!options) throw new Error(`Options required`);

    this._options = {
      path,
      type: options.type,
      validators: _.compact(_.isArray(options.validate) ? options.validate : [ options.validate ]),
      setters: _.compact([ options.set ])
    }
  }

  static validatorsFor(path, options) {
    if (!options) return []

    const validators = Array.isArray(options.validate)
      ? options.validate
      : _.compact([ options.validate ])

    // Required validators
    if (options.required) {
      validators.push({
        validator(val) {
          return !_.isNil(val)
        },
        message: `${path} required`
      })
    }

    // Minimum validators
    if (options.min) {
      validators.push({
        validator(val) {
          switch(options.type.toUpperCase())  {
            case TYPE_VARCHAR: return val.length >= options.min;
            case TYPE_INTEGER: return val >= options.min;
            default: true
          }
        },
        message: `Minimin length of ${options.min}`
      })
    }

    // Max validators
    if (options.max) {
      validators.push({
        validator(val) {
          switch(options.type.toUpperCase())  {
            case TYPE_VARCHAR: return val.length <= options.min;
            case TYPE_INTEGER: return val <= options.min;
            default: true
          }
        },
        message: `Maximum length of ${options.max}`
      })
    }

    // Enum validators
    if (options.enum) {
      const normalizedEnum = options.enum.map(i => i.toLowerCase());
      validators.push({
        validator(val) {
          switch(options.type.toUpperCase())  {
            case TYPE_VARCHAR: return normalizedEnum.indexOf(val.toLowerCase());
            default: true
          }
        },
        message: `Can only have ff values: ${options.enum.join(', ')}`
      })
    }
  }

  static settersFor(options) {
    if (!options) return []

    const setters = [];

    switch(options.type) {
      case TYPE_VARCHAR:
        setters.push(function(val) {
          return _.toString(val)
        })
        break;

      case TYPE_INTEGER:
        setters.push(function(val) {
          return _.toInteger(val)
        })
        break;

      default:
        throw new Error(`Invalid type '`, options.type, `'`)
    }

    return setters;
  }

  get setters() {
    return $.get(this, '_options.setters');
  }

  get validators() {
    return $.get(this, '_options.validators');
  }

  get path() {
    return $.get(this, '_options.path');
  }

  get type() {
    return $.get(this, '_options.type');
  }

  inspect() {
    log(`-------------------- PATH --------------------`)
    log(`Name,      `, this.path)
    log(`Type,  `, this.type)
    log(`Setters `, this.setters);
    log(`Validators `, this.validators);
  }

  /**
   * Run setters on value
   * @param {*} value
   */
  transform(value) {
    return _.reverse(this.setters).reduce((res, fn) => fn(res), value)
  }

  /**
   * Run validators agains value
   * @param {*} value
   */
  validate(value) {
    // Tripped Validator
    const validator = _.reverse(this.validators).find(val => !val.fn(value));

    return validator && (validator.message || 'Validation Error').replace('{VALUE}', value)
  }
}
