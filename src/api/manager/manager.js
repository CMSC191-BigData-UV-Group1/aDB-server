'use strict';

const log = require('debug')('manager');

import Database from '../database';
import Parser from '../parser';

export default class Manager {
  constructor(props) {
    // load databases from file and cache here
  }

  /**
   * Run an sql command
   * @returns {*}
   * @throws {*}
   */
  run(sql) {

    log(`======== RUNNING ========`)
    log(`DB   `, 'default')
    log(`Sql  `, sql)

    // Connect to default DB
    const db = Database.open('default', { createNotExist: true });

    // generate query tree
    const commands = Parser.parse(sql);

    log(`parsed   `, commands)

  }
}
