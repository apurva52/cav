import { BusinessHealthTable } from './business-health.model';


export const BUSINESS_HEALTH_TABLE: BusinessHealthTable = {
   
    paginator: {
      first: 1,
      rows: 2,
      rowsPerPageOptions: [2,3,4, 5, 10, 25, 50, 100],
    },

    headers: [
      {
        cols: [
          {
            label: 'Store Name',
            valueField: 'storeName',
            classes: 'text-center',
            severityColorField: true,
            filter: {
              isFilter: true,
              type:'contains'
            },
            isSort:true
          },
          {
            label: 'Response Time',
            valueField: 'time',
            classes: 'text-right',
            filter: {
              isFilter: true,
              type:'contains'
            },
            isSort:true
          },
          {
            label: 'Pvs',
            valueField: 'pvs',
            classes: 'text-center',
            filter: {
              isFilter: true,
              type:'contains'
            },
            isSort:true
          },
          {
            label: 'Error %',
            valueField: 'error',
            classes: 'text-center',
            drillField: true,
            filter: {
              isFilter: true,
              type:'contains'
            },
            isSort:true
          },
        ],
      },
    ],
    data: [
      {
        storeName: '1',
        time: '08/26/2020 12:05:04',
        pvs: 'Page Alert',
        error: 'Home',
        severityColor: '#FF8484',
        rowBgColor: '#ff8484',
        severity:'Critical'
      },
      {
        storeName: '2',
        time: '08/26/2020 10:05:04',
        pvs: 'Page Alert',
        error: 'Home',
        severityColor: '#FFDBDB',
        rowBgColor: '#ffdbdb',
        severity:'Major'
      },
      {
        storeName: '3',
        time: '08/26/2020 17:05:04',
        pvs: 'Page Alert',
        error: 'Home',
        severityColor: '#FF8484',
        rowBgColor: '#ff8484',
        severity:'Minor'
      },
      {
        storeName: '4',
        time: '08/26/2020 13:05:04',
        pvs: 'Page Alert',
        error: 'Home',
        severityColor: '#FFDBDB',
        rowBgColor: '#ffdbdb',
        severity:'Minor'
      },
      {
        storeName: '5',
        time: '08/26/2020 19:05:04',
        pvs: 'Page Alert',
        error: 'Home',
        severityColor: '#FF8484',
        rowBgColor: '#ff8484',
        severity:'Critical'
      },
     
    ],

    filters: [
      {
        name: 'All',
        key: 'all',
        color: '#6197c7',
        selected: true,
        showInLegend: false,
      },
      {
        name: 'Critical',
        key: 'critical',
        color: '#FF8484',
        selected: false,
        showInLegend: true,
      },
      {
        name: 'Major',
        key: 'major',
        color: '#FFB5B5',
        selected: false,
        showInLegend: true,
      },
      {
        name: 'Minor',
        key: 'minor',
        color: '#FFDBDB',
        selected: false,
        showInLegend: true,
      },
    ],
    tableFilter: true,
  };