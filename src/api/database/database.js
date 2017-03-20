
'use strict';

const log = require('debug')('database');

import _ from 'lodash';
import $ from 'object-path';
import fs from 'fs-extra';
import path from 'path';
import globber from 'require-glob';``
import { PATH_DATA_ROOT, DB_PREFIX } from './database.constants';
import TableSchema from '../database-table';

export default class DatabaseType {
  constructor(options) {
    if (!options) throw new Error(`Options required`);
    if (!options.name) throw new Error(`Name required`);
    if (!options.location) throw new Error(`Location required`);

    this._options = {
      name:     options.name,
      location: options.location,
      tables:   { }
    }

    // Add tables
    if (options.tables && Array.isArray(options.tables))
      options.tables.map(t => this.table(t.name, t));
  }

  get name() {
    return $.get(this, '_options.name');
  }

  get tables() {
    return $.get(this, '_options.tables');
  }

  get location() {
    return $.get(this, '_options.location');
  }

  /**
   * Get / Create a table model
   *
   * @param {String} name
   * @param {Schema} schema
   */
  table(name, schema) {
    if (!name) throw new Error(`Table name required`);

    const normalizedName = name.toLowerCase();

    // Getter
    if (schema) {
      log(`============ GET TABLE ============`)
      log(`Name   `, name)
      return $.get(this, '_options.tables.' + normalizedName);
    }

    log(`============ SET TABLE ============`)
    log(`Name     `, name)
    log(`Schema   `, schema)

    // Setter
    if (this.tables[normalizedName]) throw new Error(`Table ${name} already exists in DB '${this.name}'`);

    // Check schema
    if (!(schema instanceof TableSchema)) throw new Error(`Invalid schema '`, schema, `'`);

    // Add to map of tables
    $.set(this, '_options.tables.' + normalizedName, schema);

    // return table instance
    return this.tables[normalizedName];
  }

  /**
   * Create a database connection
   *
   * @param {*} options
   */
  static create(options) {
    if (!options) throw new Error(`Options required`);
    if (!options.name) throw new Error(`DB Name required`);

    // normalize name
    const normalizedName = options.name.toLowerCase();

    // data path
    const dbPath = path.join(PATH_DATA_ROOT, DB_PREFIX + normalizedName);

    // Check exist / validity
    if (fs.exists(dbPath))
      throw new Error(`DB with same name exists '${options.name}'`);

    // Write db metadata
    fs.outputFileSync(path.join(dbPath, 'meta.json'), JSON.stringify({
      name: normalizedName
    }, null, 2));

    // Create DB instance
    return new this({
      name: normalizedName,
      location: dbPath
    })
  }

  /**
   * Open a database connection
   *
   * @param {String}  name
   * @param {Object}  options
   * @param {Boolean} options.createNotExist
   */
  static open(name, options) {
    if (!name) throw new Error(`DB Name required`);

    // normalize name
    const normalizedName = name.toLowerCase();

    // data path
    const dbPath = path.join(PATH_DATA_ROOT, DB_PREFIX + normalizedName);

    if (!fs.exists(dbPath)) {
      // If !exist, create new
      if (options && options.createNotExist)
        return this.create({ name })

      throw new Error(`Db not found '${name}'`)
    }

    // Find tables
    const globbedTables = globber.sync([path.join(dbPath + '/tb-*/meta.json')]);

    log(`globbedTables `, globbedTables);

    // Create TableTypes
    const tables = _.reduce(globbedTables, (r, meta, path) => r.concat(new TableSchema(meta)), [])

    // Create DB instance
    return new this({
      name: normalizedName,
      location: dbPath,
      tables
    })
  }
}
