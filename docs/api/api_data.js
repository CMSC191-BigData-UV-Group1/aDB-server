define({ "api": [
  {
    "type": "get",
    "url": "/api/manager/run",
    "title": "Run an sql query",
    "group": "Manager",
    "parameter": {
      "fields": {
        "Account": [
          {
            "group": "Account",
            "type": "string",
            "optional": false,
            "field": "sql",
            "description": "<ul> <li>sql query</li> </ul>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"sql\": \"SELECT * from COURSE\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "SyntaxError",
            "description": "<p>syntax error</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 301 Syntax Error\n{\n  \"error\": \"Syntax Error near 'SELECT'\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/manager/manager.routes.js",
    "groupTitle": "Manager",
    "name": "GetApiManagerRun"
  },
  {
    "type": "post",
    "url": "/api/manager/run",
    "title": "Run an sql query",
    "group": "Manager",
    "parameter": {
      "fields": {
        "Account": [
          {
            "group": "Account",
            "type": "string",
            "optional": false,
            "field": "sql",
            "description": "<ul> <li>sql query</li> </ul>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"sql\": \"SELECT * from COURSE\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "SyntaxError",
            "description": "<p>syntax error</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 301 Syntax Error\n{\n  \"error\": \"Syntax Error near 'SELECT'\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/manager/manager.routes.js",
    "groupTitle": "Manager",
    "name": "PostApiManagerRun"
  }
] });
