
'use strict';

import Table, { TYPE_INTEGER, TYPE_VARCHAR } from '../database-table';

export default new Table({
  name: 'StudentCourse',
  columns: {
    Semester:               {
                              type: TYPE_VARCHAR,
                              enum: ['1st', '2nd', 'summer']
                            },
    CNo:                    {
                              type: TYPE_VARCHAR,
                              max: 50
                            },
    StudNo:                 {
                              type: TYPE_VARCHAR,
                              max: 50
                            },
    AcadYear:               {
                              type: TYPE_VARCHAR,
                              max: 50,
                            },
  }
})
