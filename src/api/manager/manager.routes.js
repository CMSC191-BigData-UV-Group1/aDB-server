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
    const result = await dbmanager.run(req.body.sql);

    // log result
    log(`result `, result);

    // send result
    res.status(200).json({ result });

  } catch (err) {
    // log error
    log(`run err `, err);

    // send error
    res.status(200).json({ error: err.message });
  }
});

export default router;
