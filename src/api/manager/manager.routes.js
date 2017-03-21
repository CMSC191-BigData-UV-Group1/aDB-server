'use strict';

const log = require('debug')('manager.routes');

import Manager from './manager';
import express from 'express';

const router = express.Router();
const dbmanager = new Manager();

/**
 * @api {post} /api/manager/run Run an sql query
 * @apName PostRun
 * @apiGroup Manager
 *
 * @apiParam (Account) {string}           sql - sql query
 * @apiParamExample {json} Request-Example:
 *     {
 *        "sql": "SELECT * from COURSE"
 *     }
 *
 * @apiError SyntaxError syntax error
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 301 Syntax Error
 *     {
 *       "error": "Syntax Error near 'SELECT'"
 *     }
 */
router.post('/run', async (req, res) => {
  try {
    // run sql command to the db manager
    const result = await dbmanager.run(req.body.sql);

    // log result
    log(`[POST] result `, result);

    // send result
    res.status(200).json({ result });

  } catch (err) {
    // log error
    log(`[POST] run err `, err);

    // send error
    res.status(200).json({ error: err.message });
  }
});

/**
 * @api {get} /api/manager/run Run an sql query
 * @apName PostRun
 * @apiGroup Manager
 *
 * @apiParam (Account) {string}           sql - sql query
 * @apiParamExample {json} Request-Example:
 *     {
 *        "sql": "SELECT * from COURSE"
 *     }
 *
 * @apiError SyntaxError syntax error
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 301 Syntax Error
 *     {
 *       "error": "Syntax Error near 'SELECT'"
 *     }
 */
router.get('/run', async (req, res) => {
  try {
    // run sql command to the db manager
    const result = await dbmanager.run(req.query.sql);

    // log result
    log(`[GET] result `, result);

    // send result
    res.status(200).json({ result });

  } catch (err) {
    // log error
    log(`[GET] run err `, err);

    // send error
    res.status(200).json({ error: err.message });
  }
});

export default router;
