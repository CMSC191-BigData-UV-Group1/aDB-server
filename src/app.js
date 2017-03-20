'use strict';

const log = require('debug')('app');

import express from 'express';
import http from 'http';
import cors from 'cors';
import chalk from 'chalk';
import bodyParser from 'body-parser';

// Create server
const app = express();
const server = http.createServer(app);

// Use CORS
app.use(cors());

// Bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Load Routes
require('./routes').default(app);

// Start Server
server.listen(process.env.PORT, () => log(`Server listening on port ${chalk['green'](process.env.PORT)}`));
