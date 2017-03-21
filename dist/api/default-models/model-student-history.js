
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _databaseTable = require('../database-table');

var _databaseTable2 = _interopRequireDefault(_databaseTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _databaseTable2.default({
  name: 'StudentHistory',
  columns: {
    StudNo: {
      type: _databaseTable.TYPE_VARCHAR,
      max: 50
    },
    Description: {
      type: _databaseTable.TYPE_VARCHAR,
      max: 50
    },
    DateFiled: {
      type: _databaseTable.TYPE_DATE
    },
    Action: {
      type: _databaseTable.TYPE_VARCHAR,
      max: 50
    },
    DateResolved: {
      type: _databaseTable.TYPE_DATE
    }
  }
});
//# sourceMappingURL=model-student-history.js.map