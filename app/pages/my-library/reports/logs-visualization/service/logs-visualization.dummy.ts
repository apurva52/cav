import { Table } from 'src/app/shared/table/table.model';
import { LogsVisualizationTable } from './logs-visualization.model';

export const LOGS_VISUALIZATION_TABLE: Table = {
  paginator: {
    first: 1,
    rows: 10,
    rowsPerPageOptions: [3, 5, 10, 25, 50, 100],
  },
  headers: [
    {
      cols: [
        {
          label: 'Report Name',
          valueField: 'ReportName',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Report Time',
          valueField: 'reportTime',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'File Name',
          valueField: 'fileName',
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
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 2',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 2',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 2',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 2',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },

    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 2',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 2',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 2',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 2',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },
    {
      ReportName: 'Test Report',
      reportTime: '12:30 PM 26/07/2020',
      fileName: 'Filename 1',
    },

  ],
  tableFilter: true,
};
