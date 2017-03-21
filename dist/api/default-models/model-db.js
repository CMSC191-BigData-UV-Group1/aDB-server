
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.db = undefined;

var _database = require('../database');

var _database2 = _interopRequireDefault(_database);

var _modelCourse = require('./model-course');

var _modelCourse2 = _interopRequireDefault(_modelCourse);

var _modelCourseOffering = require('./model-course-offering');

var _modelCourseOffering2 = _interopRequireDefault(_modelCourseOffering);

var _modelStudent = require('./model-student');

var _modelStudent2 = _interopRequireDefault(_modelStudent);

var _modelStudentCourse = require('./model-student-course');

var _modelStudentCourse2 = _interopRequireDefault(_modelStudentCourse);

var _modelStudentHistory = require('./model-student-history');

var _modelStudentHistory2 = _interopRequireDefault(_modelStudentHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Connect to default DB
var db = exports.db = _database2.default.open('default', { createNotExist: true });

// Add table schemas
db.table('Course', _modelCourse2.default);
db.table('CourseOffering', _modelCourseOffering2.default);
db.table('Student', _modelStudent2.default);
db.table('StudentCourse', _modelStudentCourse2.default);
db.table('StudentHistory', _modelStudentHistory2.default);

// inspect connection
// db.inspect()

exports.default = db;
//# sourceMappingURL=model-db.js.map