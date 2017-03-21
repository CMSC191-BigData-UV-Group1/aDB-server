'use strict';

import path from 'path';
import express from 'express';
import { red, green, blue } from 'chalk';

export default function(app) {

  // Insert routes below
  app.use('/api/manager',    require('./api/manager').routes);

  // Developers docs
  app.use('/docs/server', express.static(path.join(__dirname, '../docs/source')));
  app.use('/docs/api', express.static(path.join(__dirname, '../docs/api')));

  // Alternate Fallback
  app.route('*').get((req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
}
