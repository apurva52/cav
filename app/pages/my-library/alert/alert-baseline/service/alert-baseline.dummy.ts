import { Table } from 'src/app/shared/table/table.model';

export const ALERT_BASELINE_TABLE: Table = {

  paginator: {
    first: 1,
    rows: 10,
    rowsPerPageOptions: [3, 5, 10, 25, 50, 100],
  },
  headers: [
    {
      cols: [
      
        {
          label: 'Name',
          valueField: 'name',
          classes: 'text-left',
          iconField: true,
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          
        },
        {
          label: 'Type',
          valueField: 'type',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Time Period',
          valueField: 'timeperiod',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Override Days',
          valueField: 'overridedays',
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
      
      name: 'Load Index Based baseline',
      type: 'Load Index Based baseline',
      timeperiod: 'Last 30 Days',
      overridedays: 'Not Applicable',
    },
    {
      
      name: 'Load Index Based baseline',
      type: 'Load Index Based baseline',
      timeperiod: 'Last 30 Days',
      overridedays: 'Not Applicable',
    },
    {
      
      name: 'Load Index Based baseline',
      type: 'Load Index Based baseline',
      timeperiod: 'Last 30 Days',
      overridedays: 'Not Applicable',
    },
    {
      
      name: 'Load Index Based baseline',
      type: 'Load Index Based baseline',
      timeperiod: 'Last 30 Days',
      overridedays: 'Not Applicable',
    },
    {
      
      name: 'Load Index Based baseline',
      type: 'Load Index Based baseline',
      timeperiod: 'Last 30 Days',
      overridedays: 'Not Applicable',
    },
    {
      
      name: 'Load Index Based baseline',
      type: 'Load Index Based baseline',
      timeperiod: 'Last 30 Days',
      overridedays: 'Not Applicable',
    },
    {
      
      name: 'Load Index Based baseline',
      type: 'Load Index Based baseline',
      timeperiod: 'Last 30 Days',
      overridedays: 'Not Applicable',
    },
    {
      
      name: 'Load Index Based baseline',
      type: 'Load Index Based baseline',
      timeperiod: 'Last 30 Days',
      overridedays: 'Not Applicable',
    },
    {
  
      name: 'Load Index Based baseline',
      type: 'Load Index Based baseline',
      timeperiod: 'Last 30 Days',
      overridedays: 'Not Applicable',
    },
   
  ],


};
