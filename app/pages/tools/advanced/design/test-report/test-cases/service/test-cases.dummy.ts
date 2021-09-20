import { Table } from 'src/app/shared/table/table.model';
import { testCasesTable } from './test-cases.model';

export const TEST_CASES_TABLE_DATA: testCasesTable = {

    paginator: {
      first: 1,
      rows: 33,
      rowsPerPageOptions: [5, 10, 25, 50, 100],
    },
  
    headers: [
      {
        cols: [
          {
            label: 'Test Case ID',
            valueField: 'id',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Test Decsription',
            valueField: 'decsription',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Test Number',
            valueField: 'testNumber',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Status Report',
            valueField: 'statusReport',
            classes: 'text-centre',
            selected: true,
            iconField: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          // {
          //   label: 'Pre Log',
          //   valueField: 'preLog',
          //   classes: 'text-left',
          //   selected: true,
          //   filter: {
          //     isFilter: true,
          //     type: 'contains',
          //   },
          //   isSort: true,
          // },
          // {
          //   label: 'Post Log',
          //   valueField: 'postLog',
          //   classes: 'text-left',
          //   selected: true,
          //   filter: {
          //     isFilter: true,
          //     type: 'contains',
          //   },
          //   isSort: true,
          // },
          // {
          //   label: 'Test Log',
          //   valueField: 'testLog',
          //   classes: 'text-left',
          //   selected: true,
          //   filter: {
          //     isFilter: true,
          //     type: 'contains',
          //   },
          //   isSort: true,
          // },
        ],
      },
    ],
    data: [
      {
        id: 'Tunnel <',
        decsription: 'Tunnel',
        testNumber: '1503',
        statusReport: '',
        icon: 'icons8 icons8-ok',
      },
      {
        id: 'Tunnel <',
        decsription: 'Tunnel',
        testNumber: '1503',
        statusReport: '',
        icon: 'icons8 icons8-ok',
      },
      {
        id: 'Tunnel <',
        decsription: 'Tunnel',
        testNumber: '1503',
        statusReport: '',
        icon: 'icons8 icons8-ok',
      },
      {
        id: 'Tunnel <',
        decsription: 'Tunnel',
        testNumber: '1503',
        statusReport: '',
        icon: 'icons8 icons8-ok',
      },
      {
        id: 'Tunnel <',
        decsription: 'Tunnel',
        testNumber: '1503',
        statusReport: '',
        icon: 'icons8 icons8-ok',
      },
      {
        id: 'Tunnel <',
        decsription: 'Tunnel',
        testNumber: '1503',
        statusReport: '',
        icon: 'icons8 icons8-ok',
      },
      
    ],
  
    tableFilter: false,
    iconsField: 'icon',
  };