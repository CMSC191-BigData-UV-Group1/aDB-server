'use strict';

import { Parser } from '../parser/parser';

export default class Manager {
  constructor(props) {
    // load databases from file and cache here
  }

  /**
   * Get list of databases
   * @returns {*} map of database metadata
   */
  getDatabases() {

  }

  /**
   * Get list of tables of a database
   * @param {String} database - database name
   * @returns {*} map of the database's tables' metadata
   */
  getTables(database) {

  }

  /**
   * Run an sql command
   * @returns {*}
   * @throws {*}
   */
  run(sql) {
    // generate query tree
    const queryTree = Parser.parse(sql);

    return queryTree;
  }
}
