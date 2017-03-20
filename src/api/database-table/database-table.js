
'use strict';

const log = require('debug')('database-table');

import _ from 'lodash';
import $ from 'object-path';
import fs from 'fs-extra';
import path from 'path';
import { TABLE_PREFIX } from './database-table.constants';
import FieldDefinition from './field-definition';
export default class TableSchema {
  constructor(options) {
    if (!options) throw new Error(`Options required`);
    if (!options.name) throw new Error(`Name required`);
    if (!options.columns) throw new Error(`Schema required`);

    this._options = {
      name:     options.name,
      columns:   { },
    }

    // Add columns
    if (_.isPlainObject(options.columns))
      _.keys(options.columns).map(s => this.column(s, options.columns[s]));

  }

  get name() {
    return $.get(this, '_options.name');
  }

  get location() {
    return $.get(this, '_options.location');
  }

  get columns() {
    return $.get(this, '_options.columns');
  }

  inspect() {

    log(`Name,      `, this.name)
    log(`Location,  `, this.location)
    log(`Options   `, this._options)
    log(`+++++++++++++++++ COLUMNS +++++++++++++++++`)

    _.keys(this.columns).map(col => this.columns[col].inspect())
  }

  /**
   *
   * @param {string} name
   * @param {object} [definition]
   */
  column(name, definition) {
    if (!name) throw new Error(`Column name required`);

    const normalizedName = name.toLowerCase();

    // Getter
    if (!definition) {
      // log(`============ GET COLUMN ============`)
      // log(`Name   `, name)
      return $.get(this, '_options.columns.' + normalizedName);
    }

    // log(`============ SET COLUMN ============`)
    // log(`Name       `, name)
    // log(`Definition `, definition)

    // Setter
    if (this.columns[normalizedName]) throw new Error(`Column ${name} already exists in Table '${this.name}'`);

    // create definition
    const fieldDef = new FieldDefinition(name, definition);

    // Add to map of tables
    $.set(this, '_options.columns.' + normalizedName, fieldDef);

    // return table instance
    return this.columns[normalizedName];
  }

  attach(database) {
    if (this._options.attached) throw new Error('Already attached');

    if (!database) throw new Error(`DB instance required`);

    const Database = require('../database').default;

    if (!(database instanceof Database)) throw new Error(`Invalid DB instance '`, database,`'`);

    const normalizedName = this.name.toLowerCase();

    const dbPath = path.join(database.location, TABLE_PREFIX + normalizedName);

    $.set(this, '_options.location', dbPath)

    // log(`Attaching `, this.name, `to DB`, database.name)
    // log(`dbPath @ `, dbPath)

    // Write table metadata
    fs.outputFileSync(path.join(dbPath, 'meta.json'), JSON.stringify({
      database: database.name,
      name: this.name,
      schema: this.columns
    }, null, 2));
  }

  validate(mappings) {
    // Transform values
    return _.reduce(mappings, (res, val, key) => {
      const normalizedKey = key.toLowerCase();
      // Not a registered column
      if (!this.columns[normalizedKey]) return;

      // Run setters
      const trans = this.columns[normalizedKey].transform(val);

      // Run validators
      const error = this.columns[normalizedKey].validate(val);
      if (error) throw new Error(error);

      return {
        ... res,
        [normalizedKey]: trans
      }
    }, {})
  }

  static mapParsed(parsed) {
    return parsed.formalValues.reduce((r, col, ind) => ({
      ...r,
      [col]: parsed.actualValues[ind]
    }), {})
  }

  async insert(mappings) {

    // Retrieve dataset to write into
    const dataSetPath = path.join(this.location, 'ds-1.json');

    log(`=========== INSERT =========`);
    log(`Table    `, this.name);
    log(`Mappings `, mappings);
    log(`WritePath `, dataSetPath);

    // Transform and validate
    const toWrite = this.validate(mappings);

    log(`ToWrite   `, toWrite);

    // Load dataset
    const dataSet = fs.existsSync(dataSetPath)
      ? fs.readJsonSync(dataSetPath)
      : []

    log(`Start DataSet `, dataSet)

    // Add new item
    dataSet.push(toWrite);

    log(`End DataSet `, dataSet)

    // Save dataset
    fs.outputJsonSync(dataSetPath, dataSet)
  }

  async find(filter, projection) {

    // Retrieve dataset to read into
    const dataSetPath = path.join(this.location, 'ds-1.json');

    // clean filter
    filter = _.pickBy(filter, v => v !== undefined)

    log(`=========== FIND =========`);
    log(`Table    `, this.name);
    log(`Filter   `, filter);
    log(`Projection `, dataSetPath);

    // Load dataset
    const dataSet = fs.existsSync(dataSetPath)
      ? fs.readJsonSync(dataSetPath)
      : []

    const conformFieldFunction = (filter, key) => ({
      [key.toLowerCase()]: v => _.eq(v, filter[key])
    })

    const comparisonFunction = _.conforms(_.keys(filter).reduce((r, key) => ({ ...r, ... conformFieldFunction(filter, key)  }), {}))

    log(`comparisonFunction `, comparisonFunction);

    // Filter
    const filtered = _.filter(dataSet, comparisonFunction);

    // Project
    return _.isEmpty(projection)
      ? filtered
      : filtered.map(i => _.pick(i, projection.map(k => k.toLowerCase())))
  }
}
