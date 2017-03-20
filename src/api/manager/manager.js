'use strict';

const log = require('debug')('manager');

import Parser from '../parser';
import db from '../default-models/model-db';
export default class Manager {
  constructor(props) {
    // load databases from file and cache here
  }

  /**
   * Run an sql command
   * @returns {Promise<object>}
   * @throws {*}
   */
  async run(sql) {

    log(`======== RUNNING ========`)
    log(`DB   `, 'default')
    log(`Sql  `, sql)

    // generate query tree
    const parsed = Parser.parse(sql);
    // const parsed = {
    //   type: 'insert',
    //   table: 'COURSE',
    //   formalValues: [
    //     'CNo',
    //     'CTitle',
    //     'CDesc',
    //     'NoOfUnits',
    //     'HasLab',
    //     'SemOffered'
    //   ],
    //   actualValues: [
    //     'CMSC 191',
    //     'Special Topics',
    //     'Big Data Management and Trends',
    //     '3.0',
    //     '1',
    //     '1st'
    //   ]
    // }

    // const parsed = {
    //   type: 'select',
    //   data: {
    //     CNo: 'COURSE',
    //     CTitle: 'COURSE',
    //     AcadYear: 'COURSEOFFERING'
    //   },
    //   columnAlias: {
    //     CNo: 'a',
    //     CTitle: 'a',
    //     AcadYear: 'b'
    //   },
    //   tableAlias: {
    //     a: 'COURSE',
    //     b: 'COURSEOFFERING'
    //   },
    //   conditions: {
    //     COURSE: {
    //       CNo: 'CMSC 191'
    //     }
    //   }
    // }

    log(`parsed   `, parsed)

    switch(parsed.type) {
      case 'insert':
        const Table = db.table(parsed.table);
        if (!Table) throw new Error(`Invalid table '${parsed.table}'`)
        const mappedInsert = Table.mapParsed(parsed);
        return Table.insert(mappedInsert)

      case 'select':
        return db.select(parsed)
    }
  }
}
