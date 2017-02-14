# **Development**
- clone the repo `https://github.com/CMSC191-BigData-UV-Group1/aDB-server.git`
- create a gitignore'd `.env` file in the root of the project

        // .env file (following values are just recommended values)
        # ==================================
        #              APP
        # ==================================

        PORT=3000

        # ==================================
        #          DEBUG MODULES
        # ==================================

        # this will output all debug-log with namespace starting with 'app'
        DEBUG=app*

- run these
  
        npm install
        npm run dev 

- create your own development branch named whatever you want except: `production`, `staging`, `testing`, `feature/xxx`
- code
- integrate (push)
  + push to remote branch `testing` if you want to test
  + push to remote branch `staging` if you want to build (mimic production), test and deploy the code in the staging endpoint
  + send push request to remote branch `production` if you want to deploy code in production endpoint
        
# **Architecure**

## **Project Structure**

    |-- dist                            - built(transpiled) files
    |-- src                             - source code
    |   |-- api
    |   |   `-- moduleX                 - module folder
    |   |       |-- moduleX.spec.js     - module unit test
    |   |       |-- moduleX.js          - module class or functions
    |   |       `-- index.js            - exposed attributes/functions of the module
    |   |
    |   |-- routes.js                   - routes to expose
    |   |-- app.js                      - server setup
    |   `-- index.js                    - adds polyfill (for async/await)
    |
    |-- .babelrc                        - babel config files (ES7)
    |-- .editorconfig                   - IDE config (we can have different versions of this)
    |-- .npmrc                          - npm configuration
    |-- .nvmrc                          - if you use nvm for multiple node versions
    |-- Procfile                        - will be used by heroku
    `-- README.md                       

## **Modules**

### *Class* `Manager`
- dbms main class

### *Functions* `Parser`
- functions dealing with parsing and building query trees
# **Technologies** 

## **misc**

- ES Next (ES7) Tutorials - <https://babeljs.io/learn-es2015>
- MarkDown - <https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet>
- 12 Factor App - <https://12factor.net/>
- dotenv (implements the 3rd factor of the 12 factor app)
- Continuous Integration/Development - <https://blog.openshift.com/cicd-with-openshift/>

## **npm modules**

- `babel-cli`, `babel-core`, `babel-preset-es2015`, `babel-preset-stage-0` -- babel transpiler tech

- `babel-tape-runner`, `tape`, `tape-async`, `faucet` -- testing library and runner

- `rimraf` -- cross-platform equivalent of `rm -rf`

- `cross-env` -- cross-platform environment variable loader

- `dotenv` -- multiple environment variables loader

- `babel-polyfill` -- nodejs async-await polyfill

- `chalk` -- console colors

- `cors` -- *CORS* connect middleware / helper

- `debug` -- controlled debugging

- `express` -- server framework

- `lodash` -- *Array*, *Object*, *String*, *etc.* utilities

# Conventions

- use `save-exact` when adding npm modules

        // long version
        npm install --save --save-exact some-module

        // short version
        npm i -SE some-module

- use strict mode in every js file

        // some-file.js
        'use strict';

        // some codes

- create a debug-logger in files where you would use `console.log` to control logging

        // some-file.js
        'use strict;

        // use the file name as first param of the debug module
        const log = require('debug')('some-file')

        // some codes
