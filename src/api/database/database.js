
'use strict';

const log = require('debug')('database');

import _ from 'lodash';
import $ from 'object-path';
import fs from 'fs-extra';
import path from 'path';
import globber from 'require-glob';``
import { PATH_DATA_ROOT, DB_PREFIX } from './database.constants';

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
    // if (options.tables && Array.isArray(options.tables))
    //   options.tables.map(t => this.table(t.name, t));
  }

  get name() {
    return $.get(this, '_options.name');
  }

  get location() {
    return $.get(this, '_options.location');
  }

  get tables() {
    return $.get(this, '_options.tables');
  }

  /**
   * Get / Create a table model
   *
   * @param {String} name
   * @param {Schema} [schema]
   */
  table(name, schema) {
    if (!name) throw new Error(`Table name required`);

    const normalizedName = name.toLowerCase();

    // Getter
    if (!schema) {
      // log(`============ GET TABLE ============`)
      // log(`Name   `, name)
      return $.get(this, '_options.tables.' + normalizedName);
    }

    // log(`============ SET TABLE ============`)
    // log(`Name     `, name)
    // log(`Schema   `, schema)

    // Setter
    if (this.tables[normalizedName]) throw new Error(`Table ${name} already exists in DB '${this.name}'`);

    const TableSchema = require('../database-table').default;

    // Check schema
    if (!(schema instanceof TableSchema)) throw new Error(`Invalid schema '`, schema, `'`);

    // Attach db
    schema.attach(this);

    // Add to map of tables
    $.set(this, '_options.tables.' + normalizedName, schema);

    // return table instance
    return this.tables[normalizedName];
  }

  inspect() {
    log(`================================== DB ==================================`)
    log(`Name,      `, this.name)
    log(`Location,  `, this.location)
    // log(`Options   `, this._options)
    log(`------------------------ TABLES ------------------------`)
    _.keys(this.tables).map(tb => this.tables[tb].inspect())
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
    if (fs.existsSync(dbPath))
      throw new Error(`DB with same name exists '${options.name}'`);

    // Write db metadata
    fs.outputFileSync(path.join(dbPath, 'meta.json'), JSON.stringify({
      name: options.name
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

    if (!fs.existsSync(dbPath)) {
      // If !exist, create new
      if (options && options.createNotExist)
        return this.create({ name })

      throw new Error(`Db not found '${name}'`)
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
      location: dbPath,
      // tables
    })
  }

  async select(parsed) {

    log(`=========== SELECT =========`);
    log(`DB    `, this.name);
    log(`Parsed `, parsed);

    const TableSchema = require('../database-table').default

    // Load Tables
    const tables = _.values(parsed.tableAlias)
      .reduce((r, tableName) => ({ ...r, [tableName]: this.table(tableName) }), {})

    // log(`tables `, tables);

    const err = _.keys(tables).find(t => !(tables[t] instanceof TableSchema))

    if (err) throw new Error(`Invalid Table `, err)

    const found = {};

    // Find all in every table
    await Promise.all(_.keys(tables).map(async tableName => {
      const upperCasedKey = tableName.toUpperCase();
      const filter        = { } //parsed.conditions[upperCasedKey] || {}
      const projection    = _.keys(parsed.data)
      found[tableName] = await tables[tableName].find(filter, projection);
    }))

    log(found)

    // Natural join? (Left join?)

    // No joins
    // if (_.keys(found).length < 2) return found;

    // Merge all to index 0
    // tables.slice(1).map((table, index) => {
    //   const sameKeys = _.intersection(_.keys(tables[0].columns), _.keys(table.columns));

    //   const conformFieldFunction = (filter, key) => ({
    //     [key.toLowerCase()]: v => _.eq(v, filter[key])
    //   })

    //   const comparisonFunction = _.conforms(_.keys(filter).reduce((r, key) => ({ ...r, ... conformFieldFunction(filter, key)  }), {}))

    //   // Merge to 1st table
    //   found[0] = found[0].map(item => {



    //   })
    // })

    // Merge
    const all = _.values(found).reduce((r, v) => r.concat(v), []);
    log(`all `, all);

    let sameKeys = _.values(tables).map(t => _.keys(t.columns))
    sameKeys = sameKeys.slice(1).reduce((r, v) => _.intersection(r, v), sameKeys[0]);
    log(`SameKeys `, sameKeys);

    const grouped = _.groupBy(all, v => sameKeys.map(k => v[k]).join('-'))
    log(`grouped`, grouped);

    const merged = _.values(grouped).map(pair => pair.reduce((r, v) => ({ ...r, ...v }), {}))
    log(`Merged `, merged);

    // Filter
    const filter = _.values(parsed.conditions).reduce((r, v) => ({ ...r, ...v }), {})
    log(`Filter `, filter)

    const conformFieldFunction = (filter, key) => ({
      [key.toLowerCase()]: v => _.eq(v, filter[key])
    })

    const comparisonFunction = _.conforms(_.keys(filter).reduce((r, key) => ({ ...r, ... conformFieldFunction(filter, key)  }), {}))

    log(`comparisonFunction `, comparisonFunction);

    // Filter
    const filtered = _.filter(merged, comparisonFunction);

    log(`Filtered `, filtered)

    return filtered
  }
}
