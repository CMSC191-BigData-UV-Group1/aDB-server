'use strict';

const log = require('debug')('parser');

import _ from 'lodash';

// Tables
import COURSE from './../../tables/COURSE';
import COURSEOFFERING from './../../tables/COURSEOFFERING';
import STUDCOURSE from './../../tables/STUDCOURSE';
import STUDENT from './../../tables/STUDENT';
import STUDENTHISTORY from './../../tables/STUDENTHISTORY';

// Enums
import SemOffered from './../../enums/SemOffered';
import Semester from './../../enums/Semester';


export class Parser {
  static get regex() {
    return {
      SELECT_STATEMENT: /^\s*SELECT\s+/i,
      INSERT_STATEMENT: /^\s*INSERT\s+INTO\s+/i,
      SELECT: {
        COLUMNS: /(\s*(\w+\.)?\w+\s*,)*(\s*(\w+\.)?\w+\s*)?/,
        FROM: /^FROM\s+/i,
        TABLES: /(\s*\w+\s*(\w+)?,)*(\s*\w+\s*(\w+)?)?/,
        WHERE: /\s*WHERE\s+(\w+\.)?\w+\s*=\s*(((\w+\.)?\w+)|(\'.*\'));/i
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

  static processSELECT(sql) {
    let res = {
      data: {},
      columnAlias: {},
      tableAlias: {},
      conditions: {}
    };

    // Removed processed regex
    sql = sql.replace(Parser.regex.SELECT_STATEMENT, '');

    // Check for syntax error
    if (!sql.match(Parser.regex.SELECT.COLUMNS)) {
      return `Syntax error near ${sql}`;
    }

    // Parse the columns
    let requestedColumns = sql.match(Parser.regex.SELECT.COLUMNS)[0].split(',');
    requestedColumns = requestedColumns.map(e => e.trim());

    // Check for alias
    requestedColumns.forEach(e => {
      if (e.match(/\w+\.\w+/))
        res.columnAlias[e.replace(/\w+\./, '')] = e.replace(/\.\w+/, '');
    });

    // Remove alias
    requestedColumns = requestedColumns.map(e => e.replace(/\w+\./, ''));

    // Removed processed regex
    sql = sql.replace(Parser.regex.SELECT.COLUMNS, '');

    // Check for syntax error
    if (!sql.match(Parser.regex.SELECT.FROM)) {
      return `Syntax error near ${sql}`;
    }


    // Removed processed regex
    sql = sql.replace(Parser.regex.SELECT.FROM, '');

    // Check for syntax error
    if (!sql.match(Parser.regex.SELECT.TABLES)) {
      return `Syntax error near ${sql}`;
    }

    // Parse the tables
    let requestedTables = sql.match(Parser.regex.SELECT.TABLES)[0].split(',');
    requestedTables = requestedTables.map(e => e.trim());

    // Check for alias
    requestedTables.forEach(e => {
      if (e.match(/\w+\s+\w+/))
        res.tableAlias[e.replace(/\w+\s+/, '')] = e.replace(/\s+\w+/, '');
    });

    // Remove alias
    requestedTables = requestedTables.map(e => e.replace(/\s+\w+/, ''));

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

      // Ambiguous columns (if no aliasing)
      if (count > 1 && _.isEmpty(res.columnAlias) && _.isEmpty(res.tableAlias)) {
        return `Column '${col}' in field list is ambiguous`;
      }

      // Reduce the data based on aliasing (if there is)
      res.data = {};

      for (let i of Object.keys(res.columnAlias)) {
        res.data[i] = res.tableAlias[res.columnAlias[i]];
      }
    }

    // Removed processed regex
    sql = sql.replace(Parser.regex.SELECT.TABLES, '');

    // Check for syntax error
    if (!sql.match(Parser.regex.SELECT.WHERE)) {
      return `Syntax error near ${sql}`;
    }

    // Parse conditions
    let conditions = sql.match(Parser.regex.SELECT.WHERE)[0];
    // Check for syntax error
    if (!sql.match(Parser.regex.SELECT.WHERE)) {
      return `Syntax error near ${sql}`;
    }

    let cond = sql.replace(/\s*WHERE\s+/, '');
    let table = cond.split('=')[0].replace(/\.\w+\s*/, '');
    res.conditions[res.tableAlias[table]] = {};
    let temp = cond.split('=')[1].trim();
    res.conditions[res.tableAlias[table]][cond.split('=')[0].replace(/(\w+\.)?/, '')] = temp.substring(0, temp.length-1);

    return res;
  }

  static processINSERT(sql) {
    return 'INSERT is not yet implemented';
  }

  /**
   * Check grammar, and other checkables, build a query tree
   * @param {String} sql - sql command to parse
   * @returns {*}
   * @throws {*}
   */
  static parse(sql) {
    // Check if matched with SELECT statement
    if (sql.match(Parser.regex.SELECT_STATEMENT)) {
      return Parser.processSELECT(sql);
    }

    // Check if matched with INSERT statement
    if (sql.match(Parser.regex.INSERT_STATEMENT)) {
      return Parser.processINSERT(sql);
    }

    return 'Syntax Error. Please use either SELECT or INSERT statements only.';
  }
}
