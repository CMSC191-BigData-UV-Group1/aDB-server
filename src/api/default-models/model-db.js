
'use strict';

import Database from '../database';

import Course from './model-course'
import CourseOffering from './model-course-offering';
import Student from './model-student';
import StudentCourse from './model-student-course';
import StudentHistory from './model-student-history';

// Connect to default DB
export const db = Database.open('default', { createNotExist: true });

// Add table schemas
db.table('Course', Course);
db.table('CourseOffering', CourseOffering);
db.table('Student', Student);
db.table('StudentCourse', StudentCourse);
db.table('StudentHistory', StudentHistory);

// inspect connection
// db.inspect()

export default db;
