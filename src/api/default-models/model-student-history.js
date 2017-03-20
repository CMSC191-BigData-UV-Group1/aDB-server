
'use strict';

import Table, { TYPE_INTEGER, TYPE_VARCHAR, TYPE_DATE } from '../database-table';

export default new Table({
  name: 'StudentHistory',
  columns: {
    StudNo:                 {
                              type: TYPE_VARCHAR,
                              max: 50
                            },
    Description:            {
                              type: TYPE_VARCHAR,
                              max: 50
                            },
    DateFiled:              {
                              type: TYPE_DATE
                            },
    Action:                 {
                              type: TYPE_VARCHAR,
                              max: 50,
                            },
    DateResolved:           {
                              type: TYPE_DATE
                            },
  }
})
