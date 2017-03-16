'use strict';

const log = require('debug')('app');

import express from 'express';
import http from 'http';
import cors from 'cors';
import chalk from 'chalk';
import body_parser from 'body-parser';
import compression from 'compression';

// Create server
const app = express();
const server = http.createServer(app);

// Use Middlewares
app.use(body_parser.urlencoded({extended: false}));
app.use(body_parser.json());
app.use(compression());

// Use CORS
app.use(cors());

// Load Routes
require('./routes').default(app);

// Start Server
server.listen(process.env.PORT, () => log(`Server listening on port ${chalk['green'](process.env.PORT)}`));
