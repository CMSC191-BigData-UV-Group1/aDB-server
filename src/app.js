'use strict';

const log = require('debug')('app');

import express from 'express';
import http from 'http';
import cors from 'cors';
import chalk from 'chalk';

// Create server
const app = express();
const server = http.createServer(app);

// Use CORS
app.use(cors());

// Load Routes
require('./routes').default(app);

// Start Server
server.listen(process.env.PORT, () => log(`Server listening on port ${chalk['green'](process.env.PORT)}`));
