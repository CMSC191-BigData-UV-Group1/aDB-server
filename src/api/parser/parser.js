'use strict';

import _ from 'lodash';

// Tables
import COURSE         from './../../tables/COURSE';
import COURSEOFFERING from './../../tables/COURSEOFFERING';
import STUDCOURSE     from './../../tables/STUDCOURSE';
import STUDENT        from './../../tables/STUDENT';
import STUDENTHISTORY from './../../tables/STUDENTHISTORY';

// Enums
// import SemOffered     from './../../enums/SemOffered';
// import Semester       from './../../enums/Semester';


export default class Parser {
  static get regex() {
    return {
      SELECT_STATEMENT: /^\s*SELECT\s+/i,
      INSERT_STATEMENT: /^\s*INSERT\s+INTO\s+/i,
      SELECT: {
        COLUMNS: /(\*\s+)|((\w+\s*)(,\s*\w+\s*)*)/,
        FROM: /^FROM\s+/i,
        TABLES: /(\w+\s*)(,\s*\w+\s*)*/,
        WHERE: /^WHERE\s+\w+\s*=\s*((\w+)|(\'.*\'))\s*;/i
      },
      INSERT: {
        TABLE: /\w+\s+/,
        FORMAL_VALUES: /\(\s*(\w+\s*)(,\s*\w+)*\s*\)\s+/,
        VALUES: /^VALUES\s+/i,
        ACTUAL_VALUES: /\(\s*((\'.*\')|(?!,.+))\s*(,\s*(\'.*\')|(?!,.+))*\s*\)\s*;$/
      }
    };
  }

  static get tables() {
    return {
      'COURSE': COURSE,
      'COURSEOFFERING': COURSEOFFERING,
      'STUDCOURSE': STUDCOURSE,
      'STUDENT': STUDENT,
      'STUDENTHISTORY': STUDENTHISTORY
    };
  }

  static get columns() {
    let columns = [];

    for (let table of Object.keys(Parser.tables)) {
      for (let column of Parser.tables[table]['columns']) {
        columns.push(column['name']);
      }
    }

    return columns;
  }

  /**
   * Parse the SELECT statement and check for syntax errors
   * @param {String} sql - sql command to parse
   * @returns {Object} res - Object that contains the important results of the parser
   * @throws {*}
   */
  static processSELECT(sql, db) {
    /**
     * res object will contain these keys:
     *
     * data - Object that contains key-value pairs of column-table
     * conditions - the conditions in the WHERE statement (if there is)
     */
    let res = {
      data: {},
      conditions: {}
    };

    // Removed processed regex
    sql = sql.replace(Parser.regex.SELECT_STATEMENT, '');

    // Check for syntax error
    if (!sql.match(Parser.regex.SELECT.COLUMNS)) {
      throw new Error(`Syntax error near ${sql}`);
    }

    // Parse the columns
    let requestedColumns = sql.match(Parser.regex.SELECT.COLUMNS)[0].split(',');
    requestedColumns = requestedColumns.map(e => e.trim());

    // Removed processed regex
    sql = sql.replace(Parser.regex.SELECT.COLUMNS, '');

    // Check for syntax error
    if (!sql.match(Parser.regex.SELECT.FROM)) {
      throw new Error(`Syntax error near ${sql}`);
    }

    // Removed processed regex
    sql = sql.replace(Parser.regex.SELECT.FROM, '');

    // Check for syntax error
    if (!sql.match(Parser.regex.SELECT.TABLES)) {
      throw new Error(`Syntax error near ${sql}`);
    }

    // Parse the tables
    let requestedTables = sql.match(Parser.regex.SELECT.TABLES)[0].split(',');
    requestedTables = requestedTables.map(e => e.trim());

    // If "*" is selected, add all the columns of all the tables to res.data
    if (requestedColumns[0] === '*') {
      requestedTables.forEach(table => {
        Parser.tables[table]['columns'].forEach(col => {
          res.data[col.name] = table;
        });
      });
    }
    else {
      for (let i = 0; i < requestedColumns.length; i++) {
        let col = requestedColumns[i];

        let count = 0;
        requestedTables.forEach(table => {
          Parser.tables[table]['columns'].forEach(e => {
            if (e['name'] == col)
              res.data[col] = table;
          })
          count += Parser.tables[table]['columns'].filter(e => e['name'] === col).length;
        });

        // Checks for ambiguous columns (if no aliasing)
        if (count > 1) {
          throw new Error(`Column '${col}' in field list is ambiguous`);
        }
      }
    }

    // Removed processed regex
    sql = sql.replace(Parser.regex.SELECT.TABLES, '');

    // Check for syntax error
    if (!sql.match(Parser.regex.SELECT.WHERE)) {
      console.log(sql)
      throw new Error(`Syntax error near ${sql}`);
    }

    // Parse conditions
    let conditions = sql.match(Parser.regex.SELECT.WHERE)[0];

    // Check for syntax error
    if (!sql.match(Parser.regex.SELECT.WHERE)) {
      throw new Error(`Syntax error near ${sql}`);
    }

    let cond = sql.replace(/^WHERE\s+/, '');
    let column = cond.split('=')[0].trim();
    res.conditions[requestedTables[0]] = {};
    let temp = cond.split('=')[1].trim();
    res.conditions[requestedTables[0]][column] = temp.substring(0, temp.length-1);

    return res;
  }

  /**
   * Parse the INSERT statement and check for syntax errors
   * @param {String} sql - sql command to parse
   * @returns {Object} res - Object that contains the important results of the parser
   * @throws {*}
   */
  static processINSERT(sql, db) {
    /**
     * res object will contain these keys:
     *
     * table - the table where the row will be inserted
     * formalValues - the columns of the table that the data will be inserted
     * actualValues - the actual values that corresponds to each columns in the formalValues
     */
    let res = {};

    // Remove processed regex
    sql = sql.replace(Parser.regex.INSERT_STATEMENT, '');

    // Check for syntax error
    if (!sql.match(Parser.regex.INSERT.TABLE)) {
      throw new Error(`Syntax error near ${sql}`);
    }

    // Parse the table
    res['table'] = sql.match(Parser.regex.INSERT.TABLE)[0].trim();

    // Remove processed regex
    sql = sql.replace(Parser.regex.INSERT.TABLE, '');

    // Parse the formal values
    res['formalValues'] = sql.match(Parser.regex.INSERT.FORMAL_VALUES)[0].trim().replace(/\(|\)/g, '');
    res['formalValues'] = res['formalValues'].split(',').map(e => e.trim());

    // Remove processed regex
    sql = sql.replace(Parser.regex.INSERT.FORMAL_VALUES, '');

    // Check for syntax error
    if (!sql.match(Parser.regex.INSERT.VALUES)) {
      throw new Error(`Syntax error near ${sql}`);
    }

    // Remove processed regex
    sql = sql.replace(Parser.regex.INSERT.VALUES, '');

    // Check for syntax error
    if (!sql.match(Parser.regex.INSERT.ACTUAL_VALUES)) {
      throw new Error(`Syntax error near ${sql}`);
    }

    // Parse the actual values
    res['actualValues'] = sql.match(Parser.regex.INSERT.ACTUAL_VALUES)[0].trim().replace(/\(|\)|;/g, '');
    res['actualValues'] = res['actualValues'].split(',').map(e => e.trim());

    // Remove processed regex
    sql = sql.replace(Parser.regex.INSERT.ACTUAL_VALUES, '');

    if (res['formalValues'].length !== res['actualValues'].length) {
      throw new Error(`Length of formal values and actual values are not the same. Expected ${res['formalValues'].length}, got ${res['actualValues'].length}.`);
    }

    return res;
  }

  /**
   * Check grammar, and other checkables, build a query tree
   * @param {String} sql - sql command to parse
   * @returns {*}
   * @throws {*}
   */
  static parse(sql, db) {
    // Check if matched with SELECT statement
    if (sql.match(Parser.regex.SELECT_STATEMENT)) {
      return Parser.processSELECT(sql, db);
    }

    // Check if matched with INSERT statement
    if (sql.match(Parser.regex.INSERT_STATEMENT)) {
      return Parser.processINSERT(sql, db);
    }

    throw new Error('Syntax Error. Please use either SELECT or INSERT statements only.')
  }
}
