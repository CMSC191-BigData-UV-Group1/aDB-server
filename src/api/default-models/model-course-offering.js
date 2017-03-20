
'use strict';

import Table, { TYPE_INTEGER, TYPE_VARCHAR, TYPE_TIME } from '../database-table';

export default new Table({
  name: 'CourseOffering',
  columns: {
    Semester:               {
                              type: TYPE_VARCHAR,
                              enum: ['1st', '2nd', 'summer']
                            },
    AcadYear:               {
                              type: TYPE_VARCHAR,
                              max: 50,
                            },
    CNo:                    {
                              type: TYPE_VARCHAR,
                              max: 50
                            },
    Section:                {
                              type: TYPE_VARCHAR,
                              max: 50
                            },
    Time:                   {
                              type: TYPE_TIME
                            },
    MaxStud:                {
                              type: TYPE_INTEGER
                            },
  }
})
