import { Table } from "src/app/shared/table/table.model";
import { VisualChart } from "src/app/shared/visualization/visual-chart/service/visual-chart.model";
import { databaseChart } from "./database.model";

export const DATABASE_TABLE: Table = {

  paginator: {
    first: 1,
    rows: 10,
    rowsPerPageOptions: [10, 25, 50, 100],
  },

  headers: [
    {
      cols: [
        {
          label: 'Process Id',
          valueField: 'processId',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Database Name',
          valueField: 'databaseName',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'State Change Time',
          valueField: 'stateChangeTime',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Resource Lock Type',
          valueField: 'resourceLockType',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Lock Mode Name',
          valueField: 'lockModeName',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Request Status',
          valueField: 'requestStatus',
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
      processId: '29744',
      databaseName: 'Postgres',
      stateChangeTime: '2020-10-06 15:22:08',
      resourceLockType: 'Relation',
      lockModeName: 'AccessShareLock',
      requestStatus: 'Yes'
    },
    {
      processId: '29744',
      databaseName: 'Postgres',
      stateChangeTime: '2020-10-06 15:22:08',
      resourceLockType: 'Relation',
      lockModeName: 'AccessShareLock',
      requestStatus: 'Yes'
    },
    {
      processId: '29744',
      databaseName: 'Postgres',
      stateChangeTime: '2020-10-06 15:22:08',
      resourceLockType: 'Relation',
      lockModeName: 'AccessShareLock',
      requestStatus: 'Yes'
    },
    {
      processId: '29744',
      databaseName: 'Postgres',
      stateChangeTime: '2020-10-06 15:22:08',
      resourceLockType: 'Relation',
      lockModeName: 'AccessShareLock',
      requestStatus: 'Yes'
    },
    {
      processId: '29744',
      databaseName: 'Postgres',
      stateChangeTime: '2020-10-06 15:22:08',
      resourceLockType: 'Relation',
      lockModeName: 'AccessShareLock',
      requestStatus: 'Yes'
    },
    {
      processId: '29744',
      databaseName: 'Postgres',
      stateChangeTime: '2020-10-06 15:22:08',
      resourceLockType: 'Relation',
      lockModeName: 'AccessShareLock',
      requestStatus: 'Yes'
    },
    {
      processId: '29744',
      databaseName: 'Postgres',
      stateChangeTime: '2020-10-06 15:22:08',
      resourceLockType: 'Relation',
      lockModeName: 'AccessShareLock',
      requestStatus: 'Yes'
    },
    {
      processId: '29744',
      databaseName: 'Postgres',
      stateChangeTime: '2020-10-06 15:22:08',
      resourceLockType: 'Relation',
      lockModeName: 'AccessShareLock',
      requestStatus: 'Yes'
    },
    {
      processId: '29744',
      databaseName: 'Postgres',
      stateChangeTime: '2020-10-06 15:22:08',
      resourceLockType: 'Relation',
      lockModeName: 'AccessShareLock',
      requestStatus: 'Yes'
    },
    {
      processId: '29744',
      databaseName: 'Postgres',
      stateChangeTime: '2020-10-06 15:22:08',
      resourceLockType: 'Relation',
      lockModeName: 'AccessShareLock',
      requestStatus: 'Yes'
    },
    {
      processId: '29744',
      databaseName: 'Postgres',
      stateChangeTime: '2020-10-06 15:22:08',
      resourceLockType: 'Relation',
      lockModeName: 'AccessShareLock',
      requestStatus: 'Yes'
    },
    {
      processId: '29744',
      databaseName: 'Postgres',
      stateChangeTime: '2020-10-06 15:22:08',
      resourceLockType: 'Relation',
      lockModeName: 'AccessShareLock',
      requestStatus: 'Yes'
    },
    {
      processId: '29744',
      databaseName: 'Postgres',
      stateChangeTime: '2020-10-06 15:22:08',
      resourceLockType: 'Relation',
      lockModeName: 'AccessShareLock',
      requestStatus: 'Yes'
    },
    {
      processId: '29744',
      databaseName: 'Postgres',
      stateChangeTime: '2020-10-06 15:22:08',
      resourceLockType: 'Relation',
      lockModeName: 'AccessShareLock',
      requestStatus: 'Yes'
    },
    {
      processId: '29744',
      databaseName: 'Postgres',
      stateChangeTime: '2020-10-06 15:22:08',
      resourceLockType: 'Relation',
      lockModeName: 'AccessShareLock',
      requestStatus: 'Yes'
    },
    {
      processId: '29744',
      databaseName: 'Postgres',
      stateChangeTime: '2020-10-06 15:22:08',
      resourceLockType: 'Relation',
      lockModeName: 'AccessShareLock',
      requestStatus: 'Yes'
    },
    {
      processId: '29744',
      databaseName: 'Postgres',
      stateChangeTime: '2020-10-06 15:22:08',
      resourceLockType: 'Relation',
      lockModeName: 'AccessShareLock',
      requestStatus: 'Yes'
    },
    {
      processId: '29744',
      databaseName: 'Postgres',
      stateChangeTime: '2020-10-06 15:22:08',
      resourceLockType: 'Relation',
      lockModeName: 'AccessShareLock',
      requestStatus: 'Yes'
    },

  ],
};

export const DATABASE_CHART: databaseChart = {
  charts: [
    {
      title: 'File Size (MB)',
      highchart: {
        chart: {
          type: 'bar',
          height: '200px'
        },

        title: {
          text: null,
        },

        xAxis: {
          categories: ['40', '30', '20', '10', '0']
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          }
        },
        tooltip: {
          pointFormat:
            '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}',
        },
        plotOptions: {
          series: {
            stacking: 'normal'
          }
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          enabled: true,
          verticalAlign: 'middle',
          x: 0,
          y: 0,
        },
        series: [{
          name: 'Free MB',
          data: [5, 3, 4, 7, 2]
        }, {
          name: 'Used MB',
          data: [2, 2, 3, 2, 1]
        }] as Highcharts.SeriesOptionsType[],
      },
    },
  ],

};

export const FILE_SIZE_USED_CHART: VisualChart = {
  charts: [
    {
      title: 'File Size Used (%)',
      highchart: {
        chart: {
          height: '200px',
        },
        title: {
          text: null,
        },
        legend: {
          enabled: true,
          align: 'right',
          verticalAlign: 'middle',
          x: 0,
          y: 0,
          layout: 'vertical',
          itemStyle: {
            width: 70,
            color: '#333333',
            fontFamily: 'Product Sans',
            fontSize: '11px',
          },
        },
        xAxis: {
          allowDecimals: true,
          categories: ['15.00', '15.10', '15.20', '15.30', '15.40', '15.50']
        },
        yAxis: {
          title: {
            text: '',
          },
        },
        tooltip: {
          formatter: function () {
            return '<b>' + this.series.name + '</b><br/>' +
              this.x + ': ' + this.y;
          }
        },
        plotOptions: {
          area: {
            fillOpacity: 0.5
          }
        },
        series: [
          {
            name: 'AMDB(Log)',
            type: 'area',
            data: [
              15,
              15,
              15,
              15,
              15,
              15
            ],
          },
          {
            name: 'AMDB(Rows)',
            type: 'area',
            data: [
              5,
              5,
              5,
              5,
              5,
              5
            ],
          },
          {
            name: 'Dev(Log)',
            type: 'area',
            data: [
              10,
              10,
              10,
              10,
              10,
              10
            ],
          },
          {
            name: 'Dev(Rows)',
            type: 'area',
            data: [
              12,
              12,
              12,
              12,
              12,
              12
            ],
          },
          {
            name: 'Employee(Log)',
            type: 'area',
            data: [
              8,
              8,
              8,
              8,
              8,
              8
            ],
          },
        ] as Highcharts.SeriesOptionsType[],
      },
    },
  ],
};