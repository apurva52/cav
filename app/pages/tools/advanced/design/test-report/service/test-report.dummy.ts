import { Table } from 'src/app/shared/table/table.model';

export const TEST_REPORT_TABLE_DATA: Table = {

    paginator: {
      first: 1,
      rows: 33,
      rowsPerPageOptions: [5, 10, 25, 50, 100],
    },
  
    headers: [
      {
        cols: [
          {
            label: 'Test Cycle Number',
            valueField: 'cycleNo',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Test Suite Name',
            valueField: 'suiteName',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Start Time',
            valueField: 'startTime',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'End Time',
            valueField: 'endTime',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Total Cases',
            valueField: 'totalCases',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Executed',
            valueField: 'executed',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Failed To Executed',
            valueField: 'failed',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
        ],
      },
    ],
    data: [
      {
        cycleNo: '34527841515',
        suiteName: 'Network',
        startTime: '02:23 PM 23/11/2020',
        endTime: '02:23 PM 23/11/2020',
        totalCases: '131',
        executed: '44',
        failed: '13',
      },
      {
        cycleNo: '34527841515',
        suiteName: 'Network',
        startTime: '02:23 PM 23/11/2020',
        endTime: '02:23 PM 23/11/2020',
        totalCases: '131',
        executed: '44',
        failed: '13',
      },
      {
        cycleNo: '34527841515',
        suiteName: 'Network',
        startTime: '02:23 PM 23/11/2020',
        endTime: '02:23 PM 23/11/2020',
        totalCases: '131',
        executed: '44',
        failed: '13',
      },
      {
        cycleNo: '34527841515',
        suiteName: 'Network',
        startTime: '02:23 PM 23/11/2020',
        endTime: '02:23 PM 23/11/2020',
        totalCases: '131',
        executed: '44',
        failed: '13',
      },
      {
        cycleNo: '34527841515',
        suiteName: 'Network',
        startTime: '02:23 PM 23/11/2020',
        endTime: '02:23 PM 23/11/2020',
        totalCases: '131',
        executed: '44',
        failed: '13',
      },
      {
        cycleNo: '34527841515',
        suiteName: 'Network',
        startTime: '02:23 PM 23/11/2020',
        endTime: '02:23 PM 23/11/2020',
        totalCases: '131',
        executed: '44',
        failed: '13',
      },
      {
        cycleNo: '34527841515',
        suiteName: 'Network',
        startTime: '02:23 PM 23/11/2020',
        endTime: '02:23 PM 23/11/2020',
        totalCases: '131',
        executed: '44',
        failed: '13',
      },
      
    ],
  
    tableFilter: false,
  };