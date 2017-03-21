
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _databaseTable = require('../database-table');

var _databaseTable2 = _interopRequireDefault(_databaseTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _databaseTable2.default({
  name: 'Course',
  columns: {
    CNo: {
      type: _databaseTable.TYPE_VARCHAR,
      max: 50
    },
    CTitle: {
      type: _databaseTable.TYPE_VARCHAR,
      max: 50
    },
    CDesc: {
      type: _databaseTable.TYPE_VARCHAR,
      max: 50
    },
    NoOfUnits: {
      type: _databaseTable.TYPE_INTEGER
    },
    HasLab: {
      type: _databaseTable.TYPE_INTEGER
    },
    SemOffered: {
      type: _databaseTable.TYPE_VARCHAR,
      enum: ['1st', '2nd', 'summer']
    }
  }
});
//# sourceMappingURL=model-course.js.map