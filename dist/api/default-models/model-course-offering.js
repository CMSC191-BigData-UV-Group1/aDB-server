
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _databaseTable = require('../database-table');

var _databaseTable2 = _interopRequireDefault(_databaseTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _databaseTable2.default({
  name: 'CourseOffering',
  columns: {
    Semester: {
      type: _databaseTable.TYPE_VARCHAR,
      enum: ['1st', '2nd', 'summer']
    },
    AcadYear: {
      type: _databaseTable.TYPE_VARCHAR,
      max: 50
    },
    CNo: {
      type: _databaseTable.TYPE_VARCHAR,
      max: 50
    },
    Section: {
      type: _databaseTable.TYPE_VARCHAR,
      max: 50
    },
    Time: {
      type: _databaseTable.TYPE_TIME
    },
    MaxStud: {
      type: _databaseTable.TYPE_INTEGER
    }
  }
});
//# sourceMappingURL=model-course-offering.js.map