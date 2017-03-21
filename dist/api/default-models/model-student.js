
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _databaseTable = require('../database-table');

var _databaseTable2 = _interopRequireDefault(_databaseTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _databaseTable2.default({
  name: 'Student',
  columns: {
    StudNo: {
      type: _databaseTable.TYPE_VARCHAR,
      max: 50
    },
    StudName: {
      type: _databaseTable.TYPE_VARCHAR,
      max: 50
    },
    Birthday: {
      type: _databaseTable.TYPE_DATE
    },
    Degree: {
      type: _databaseTable.TYPE_VARCHAR,
      max: 50
    },
    Major: {
      type: _databaseTable.TYPE_VARCHAR,
      max: 50
    },
    UnitsEarned: {
      type: _databaseTable.TYPE_INTEGER
    }
  }
});
//# sourceMappingURL=model-student.js.map