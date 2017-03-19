'use strict';

const log = require('debug')('manager.routes');

import Manager from './manager';
import express from 'express';

const router = express.Router();
const dbmanager = new Manager();

// Async-Await version
router.post('/run', async (req, res) => {
  try {
    // run sql command to the db manager
    const result = dbmanager.run(req.body.sql);

    // log result
    log(result);

    // send result
    res.status(200).json({ result });

  } catch (error) {
    console.log(error);
    // log error
    log(error);

    // send error
    res.status(500).json({ error });
  }
});

/*
// Promise version
router.post('/run', (req, res) =>
  // run sql command to the db manager
  dbmanager.run(req.body.sql)
    .then(result => {
      // log result
      log(result);

      // send result
      res.status(200).json({ result });
    })
    .catch(error => {
      // log error
      log(error);

      // send error
      res.status(500).json({ error });
    })
);

// Promise version (shorter using comma)
router.post('/run', (req, res) =>
  // run sql command to the db manager
  dbmanager.run(req.body.sql)
    // log and send result
    .then(result => (log(result), res.status(200).json({ result })))
    // log and send error
    .catch(error => (log(error), res.status(500).json({ error })))
);
*/

export default router;
