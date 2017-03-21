define({
  "name": "ADB Server",
  "version": "0.1.0",
  "description": "ADB Server API Documentation",
  "title": "ADB Server",
  "url": "https://adb-server.herokuapp.com/api",
  "header": {
    "title": "ADB Server",
    "content": "<h1><strong>Development</strong></h1>\n<ul>\n<li>\n<p>clone the repo <code>https://github.com/CMSC191-BigData-UV-Group1/aDB-server.git</code></p>\n</li>\n<li>\n<p>create a gitignore'd <code>.env</code> file in the root of the project</p>\n<pre><code>  // .env file (following values are just recommended values)\n  # ==================================\n  #              APP\n  # ==================================\n\n  PORT=3000\n\n  # ==================================\n  #          DEBUG MODULES\n  # ==================================\n\n  # this will output all debug-log with namespace starting with 'app'\n  DEBUG=app*\n</code></pre>\n</li>\n<li>\n<p>run these</p>\n<pre><code>  npm install\n  npm run dev \n</code></pre>\n</li>\n<li>\n<p>create your own development branch named whatever you want except: <code>production</code>, <code>staging</code>, <code>testing</code>, <code>feature/xxx</code></p>\n</li>\n<li>\n<p>code</p>\n</li>\n<li>\n<p>integrate (push)</p>\n<ul>\n<li>push to remote branch <code>testing</code> if you want to test</li>\n<li>push to remote branch <code>staging</code> if you want to build (mimic production), test and deploy the code in the staging endpoint</li>\n<li>send push request to remote branch <code>production</code> if you want to deploy code in production endpoint</li>\n</ul>\n</li>\n</ul>\n<h1><strong>Architecure</strong></h1>\n<h2><strong>Project Structure</strong></h2>\n<pre><code>|-- dist                            - built(transpiled) files\n|-- src                             - source code\n|   |-- api\n|   |   `-- moduleX                 - module folder\n|   |       |-- moduleX.spec.js     - module unit test\n|   |       |-- moduleX.js          - module class or functions\n|   |       `-- index.js            - exposed attributes/functions of the module\n|   |\n|   |-- routes.js                   - routes to expose\n|   |-- app.js                      - server setup\n|   `-- index.js                    - adds polyfill (for async/await)\n|\n|-- .babelrc                        - babel config files (ES7)\n|-- .editorconfig                   - IDE config (we can have different versions of this)\n|-- .npmrc                          - npm configuration\n|-- .nvmrc                          - if you use nvm for multiple node versions\n|-- Procfile                        - will be used by heroku\n`-- README.md                       \n</code></pre>\n<h2><strong>Modules</strong></h2>\n<h3><em>Class</em> <code>Manager</code></h3>\n<ul>\n<li>dbms main class</li>\n</ul>\n<h3><em>Functions</em> <code>Parser</code></h3>\n<ul>\n<li>functions dealing with parsing and building query trees</li>\n</ul>\n<h1><strong>Technologies</strong></h1>\n<h2><strong>misc</strong></h2>\n<ul>\n<li>ES Next (ES7) Tutorials - <a href=\"https://babeljs.io/learn-es2015\">https://babeljs.io/learn-es2015</a></li>\n<li>MarkDown - <a href=\"https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet\">https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet</a></li>\n<li>12 Factor App - <a href=\"https://12factor.net/\">https://12factor.net/</a></li>\n<li>Continuous Integration/Development\n<ul>\n<li><a href=\"https://www.docker.com/use-cases/cicd\">https://www.docker.com/use-cases/cicd</a></li>\n<li><a href=\"https://technologyconversations.com/2016/01/14/the-short-history-of-cicd-tools/\">https://technologyconversations.com/2016/01/14/the-short-history-of-cicd-tools/</a></li>\n<li><a href=\"https://www.atlassian.com/continuous-delivery\">https://www.atlassian.com/continuous-delivery</a></li>\n<li><a href=\"http://www.sap.com/developer/tutorials/ci-best-practices-ci-cd.html\">http://www.sap.com/developer/tutorials/ci-best-practices-ci-cd.html</a></li>\n</ul>\n</li>\n</ul>\n<h2><strong>npm modules</strong></h2>\n<ul>\n<li>\n<p><code>babel-cli</code>, <code>babel-core</code>, <code>babel-preset-es2015</code>, <code>babel-preset-stage-0</code> -- babel transpiler tech</p>\n</li>\n<li>\n<p><code>babel-tape-runner</code>, <code>tape</code>, <code>tape-async</code>, <code>faucet</code> -- testing library and runner</p>\n</li>\n<li>\n<p><code>rimraf</code> -- cross-platform equivalent of <code>rm -rf</code></p>\n</li>\n<li>\n<p><code>cross-env</code> -- cross-platform environment variable loader</p>\n</li>\n<li>\n<p><code>dotenv</code> -- multiple environment variables loader</p>\n</li>\n<li>\n<p><code>babel-polyfill</code> -- nodejs async-await polyfill</p>\n</li>\n<li>\n<p><code>chalk</code> -- console colors</p>\n</li>\n<li>\n<p><code>cors</code> -- <em>CORS</em> connect middleware / helper</p>\n</li>\n<li>\n<p><code>debug</code> -- controlled debugging</p>\n</li>\n<li>\n<p><code>express</code> -- server framework</p>\n</li>\n<li>\n<p><code>lodash</code> -- <em>Array</em>, <em>Object</em>, <em>String</em>, <em>etc.</em> utilities</p>\n</li>\n</ul>\n<h1>Conventions</h1>\n<ul>\n<li>\n<p>use <code>save-exact</code> when adding npm modules</p>\n<pre><code>  // long version\n  npm install --save --save-exact some-module\n\n  // short version\n  npm i -SE some-module\n</code></pre>\n</li>\n<li>\n<p>use strict mode in every js file</p>\n<pre><code>  // some-file.js\n  'use strict';\n\n  // some codes\n</code></pre>\n</li>\n<li>\n<p>create a debug-logger in files where you would use <code>console.log</code> to control logging</p>\n<pre><code>  // some-file.js\n  'use strict;\n\n  // use the file name as first param of the debug module\n  const log = require('debug')('some-file')\n\n  // some codes\n</code></pre>\n</li>\n</ul>\n"
  },
  "sampleUrl": false,
  "defaultVersion": "0.0.0",
  "apidoc": "0.3.0",
  "generator": {
    "name": "apidoc",
    "time": "2017-03-21T01:47:48.595Z",
    "url": "http://apidocjs.com",
    "version": "0.17.5"
  }
});