
'use strict';

import Table, { TYPE_INTEGER, TYPE_VARCHAR, TYPE_DATE } from '../database-table';

export default new Table({
  name: 'Student',
  columns: {
    StudNo:                 {
                              type: TYPE_VARCHAR,
                              max: 50
                            },
    StudName:               {
                              type: TYPE_VARCHAR,
                              max: 50
                            },
    Birthday:               {
                              type: TYPE_DATE
                            },
    Degree:                 {
                              type: TYPE_VARCHAR,
                              max: 50,
                            },
    Major:                  {
                              type: TYPE_VARCHAR,
                              max: 50
                            },
    UnitsEarned:            {
                              type: TYPE_INTEGER
                            },
  }
})
