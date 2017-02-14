'use strict';

import express from 'express';

export default function(app) {

  // Insert routes below
  app.use('/api/manager',    require('./api/manager').routes);

}
