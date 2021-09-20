import { Table } from "src/app/shared/table/table.model";
import { MultidiskSettingTable } from "./multidisk-setting.model";

export const MULTIDISK_SETTING_DATA: MultidiskSettingTable = {
  paginator: {
    first: 1,
    rows: 33,
    rowsPerPageOptions: [5, 10, 25, 50, 100],
  },

  headers: [
    {
      cols: [
        {
          label: 'File System',
          valueField: 'pageTime',
          classes: 'text-left',
          selected: true,
          severityColorField: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Mount On',
          valueField: 'pageCount',
          classes: 'text-center',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          severity: true,
          severityColorField: true,
        },
        {
          label: 'Size ',
          valueField: 'onload',
          iconField: true,
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Available',
          valueField: 'ttd',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Health',
          valueField: 'ttdl',
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
      pageTime: 'Policy',
      pageCount: '1',
      onload: '5.76',
      ttd: '0',
      ttdl: '0',
      responseTime: '0.25',
      prt: '3.83',
      dns: '0',
      ssl: '0.25',
      lookup: '0.25',
      download: '2.32',
      tpc: '0',
      fp: '0',
      severityColor: '#FF8484',
    },
    {
      pageTime: 'Policy',
      pageCount: '1',
      onload: '5.76',
      ttd: '0',
      ttdl: '0',
      responseTime: '0.25',
      prt: '3.83',
      dns: '0',
      ssl: '0.25',
      lookup: '0.25',
      download: '2.32',
      tpc: '0',
      fp: '0',
      severityColor: '#FFDBDB',
    },
    {
      pageTime: 'Policy',
      pageCount: '1',
      onload: '5.76',
      ttd: '0',
      ttdl: '0',
      responseTime: '0.25',
      prt: '3.83',
      dns: '0',
      ssl: '0.25',
      lookup: '0.25',
      download: '2.32',
      tpc: '0',
      fp: '0',
      severityColor: '#FF8484',
    },
    {
      pageTime: 'Policy',
      pageCount: '1',
      onload: '5.76',
      ttd: '0',
      ttdl: '0',
      responseTime: '0.25',
      prt: '3.83',
      dns: '0',
      ssl: '0.25',
      lookup: '0.25',
      download: '2.32',
      tpc: '0',
      fp: '0',
      severityColor: '#FFDBDB',
    },
    {
      pageTime: 'Policy',
      pageCount: '1',
      onload: '5.76',
      ttd: '0',
      ttdl: '0',
      responseTime: '0.25',
      prt: '3.83',
      dns: '0',
      ssl: '0.25',
      lookup: '0.25',
      download: '2.32',
      tpc: '0',
      fp: '0',
      severityColor: '#FF8484',
    },
    {
      pageTime: 'Policy',
      pageCount: '1',
      onload: '5.76',
      ttd: '0',
      ttdl: '0',
      responseTime: '0.25',
      prt: '3.83',
      dns: '0',
      ssl: '0.25',
      lookup: '0.25',
      download: '2.32',
      tpc: '0',
      fp: '0'
    },
    {
      pageTime: 'Policy',
      pageCount: '1',
      onload: '5.76',
      ttd: '0',
      ttdl: '0',
      responseTime: '0.25',
      prt: '3.83',
      dns: '0',
      ssl: '0.25',
      lookup: '0.25',
      download: '2.32',
      tpc: '0',
      fp: '0'
    },
    {
      pageTime: 'Policy',
      pageCount: '1',
      onload: '5.76',
      ttd: '0',
      ttdl: '0',
      responseTime: '0.25',
      prt: '3.83',
      dns: '0',
      ssl: '0.25',
      lookup: '0.25',
      download: '2.32',
      tpc: '0',
      fp: '0'
    },
    {
      pageTime: 'Policy',
      pageCount: '1',
      onload: '5.76',
      ttd: '0',
      ttdl: '0',
      responseTime: '0.25',
      prt: '3.83',
      dns: '0',
      ssl: '0.25',
      lookup: '0.25',
      download: '2.32',
      tpc: '0',
      fp: '0'
    },
    {
      pageTime: 'Policy',
      pageCount: '1',
      onload: '5.76',
      ttd: '0',
      ttdl: '0',
      responseTime: '0.25',
      prt: '3.83',
      dns: '0',
      ssl: '0.25',
      lookup: '0.25',
      download: '2.32',
      tpc: '0',
      fp: '0'
    },
    {
      pageTime: 'Policy',
      pageCount: '1',
      onload: '5.76',
      ttd: '0',
      ttdl: '0',
      responseTime: '0.25',
      prt: '3.83',
      dns: '0',
      ssl: '0.25',
      lookup: '0.25',
      download: '2.32',
      tpc: '0',
      fp: '0'
    },
    {
      pageTime: 'Policy',
      pageCount: '1',
      onload: '5.76',
      ttd: '0',
      ttdl: '0',
      responseTime: '0.25',
      prt: '3.83',
      dns: '0',
      ssl: '0.25',
      lookup: '0.25',
      download: '2.32',
      tpc: '0',
      fp: '0'
    },
    {
      pageTime: 'Policy',
      pageCount: '1',
      onload: '5.76',
      ttd: '0',
      ttdl: '0',
      responseTime: '0.25',
      prt: '3.83',
      dns: '0',
      ssl: '0.25',
      lookup: '0.25',
      download: '2.32',
      tpc: '0',
      fp: '0'
    },
    {
      pageTime: 'Policy',
      pageCount: '1',
      onload: '5.76',
      ttd: '0',
      ttdl: '0',
      responseTime: '0.25',
      prt: '3.83',
      dns: '0',
      ssl: '0.25',
      lookup: '0.25',
      download: '2.32',
      tpc: '0',
      fp: '0'
    },
  ],
  treetable: [
    {
      "data": {
        "components": "HPD",
        "health": "75kb",
        "pdisk": "1",
        "alert": false
      },
      "children": [
        {
          "data": {
            "components": "Pagedump",
            "health": "75kb",
            "pdisk": "1",
            "alert": false
          }
        },
        {
          "data": {
            "components": "USERACTION",
            "health": "75kb",
            "pdisk": "1",
            "alert": false
          }
        },
        {
          "data": {
            "components": "CSV",
            "health": "75kb",
            "pdisk": "1",
            "alert": false
          }
        },
        {
          "data": {
            "components": "Feedback",
            "health": "150kb",
            "pdisk": "1",
            "alert": false
          }
        }
      ]
    },

    {
      "data": {
        "components": "NR_DB_UPLOAD",
        "health": "75kb",
        "pdisk": "1",
        "alert": false
      },
      "children": [
        {
          "data": {
            "components": "pagetable.csv",
            "health": "55kb",
            "pdisk": "1",
            "alert": false
          }
        },
        {
          "data": {
            "components": "sessiontable.csv",
            "health": "20kb",
            "pdisk": "1",
            "alert": false
          }
        },
        {
          "data": {
            "components": "useractiontable.csv",
            "health": "20kb",
            "pdisk": "1",
            "alert": false
          }
        },
        {
          "data": {
            "components": "feedbacktable.csv",
            "health": "20kb",
            "pdisk": "1",
            "alert": false
          }
        },
        {
          "data": {
            "components": "custommetricstable.csv",
            "health": "20kb",
            "pdisk": "1",
            "alert": false
          }
        },
        {
          "data": {
            "components": "eventstable.csv",
            "health": "20kb",
            "pdisk": "1",
            "alert": false
          }
        },
        {
          "data": {
            "components": "xrdatatable.csv",
            "health": "20kb",
            "pdisk": "1",
            "alert": false
          }
        },
        {
          "data": {
            "components": "usertimingtable.csv",
            "health": "20kb",
            "pdisk": "1",
            "alert": false
          }
        },
        {
          "data": {
            "components": "mobileappinfotable.csv",
            "health": "20kb",
            "pdisk": "1",
            "alert": false
          }
        },
        {
          "data": {
            "components": "nvcrashreporttable.csv",
            "health": "20kb",
            "pdisk": "1",
            "alert": false
          }
        },
        {
          "data": {
            "components": "nvjserrortable.csv",
            "health": "20kb",
            "pdisk": "1",
            "alert": false
          }
        }



      ]
    }

  ],
  healthCharts: [
    {
      title: '',
      highchart: {
        chart: {
          height: '50px',
        },
        credits: {
          enabled: false
        },
        title: {
          text: null,
        },
        legend: {
          enabled: false,
        },
        xAxis: {
          visible: false,
        },
        yAxis: {
          visible: false,
        },
        tooltip: {
          enabled: false,
          pointFormat:
            '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}',
        },
        plotOptions: {
          series: {
            stacking: 'normal',
            marker: {
              enabled: false,
            },
          },
        },
        series: [
          {
            name: 'USA',
            type: 'bar',
            data: [6],
          },
          {
            name: 'USSR/Russia',
            type: 'bar',
            data: [5],
          },
        ] as Highcharts.SeriesOptionsType[],
      },
    },
  ],
  severityCondition: 'severity',
  tableFilter: true,
};
