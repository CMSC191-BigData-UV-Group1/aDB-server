
'use strict';

const log = require('debug')('database-table');

import _ from 'lodash';
import $ from 'object-path';

export default class DatabaseType {
  constructor(options) {
    this._options = options;

    // Check name


    // Check tables format


    // Check location exists


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

  static create(options) {
    // Check exist / validity

    // Check tables validity

    // Write tables metadata

    // Write db metadata

    // Create DB instance
  }

  static open(databaseName) {
    // Check exist

    // Load metadata

    // Find tables

    // Load table metadata

    // Create TableTypes

    // Create DB instance
  }
}
