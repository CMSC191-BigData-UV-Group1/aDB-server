
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _databaseTable = require('../database-table');

var _databaseTable2 = _interopRequireDefault(_databaseTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _databaseTable2.default({
  name: 'StudentCourse',
  columns: {
    Semester: {
      type: _databaseTable.TYPE_VARCHAR,
      enum: ['1st', '2nd', 'summer']
    },
    CNo: {
      type: _databaseTable.TYPE_VARCHAR,
      max: 50
    },
    StudNo: {
      type: _databaseTable.TYPE_VARCHAR,
      max: 50
    },
    AcadYear: {
      type: _databaseTable.TYPE_VARCHAR,
      max: 50
    }
  }
});
//# sourceMappingURL=model-student-course.js.map