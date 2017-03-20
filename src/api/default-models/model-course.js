
'use strict';

import Table, { TYPE_INTEGER, TYPE_VARCHAR } from '../database-table';

export default new Table({
  name: 'Course',
  columns: {
    CNo:                    {
                              type: TYPE_VARCHAR,
                              max: 50
                            },
    CTitle:                 {
                              type: TYPE_VARCHAR,
                              max: 50
                            },
    CDesc:                  {
                              type: TYPE_VARCHAR,
                              max: 50
                            },
    NoOfUnits:              {
                              type: TYPE_INTEGER
                            },
    HasLab:                 {
                              type: TYPE_INTEGER
                            },
    SemOffered:             {
                              type: TYPE_VARCHAR,
                              enum: ['1st', '2nd', 'summer']
                            }
  }
})
